<script lang="ts">
	import { appState } from '$lib/utils.svelte';
	import {
		mandel_render,
		mandel_pixels_ptr,
		mandel_owner_ptr,
		mandel_tiles_done,
		mandel_tiles_total,
		mandel_tiles_x,
		mandel_tile,
		sched_num_workers,
		wasm_memory
	} from '$lib/wasm/pkg/website';
	import { onDestroy } from 'svelte';

	const WIDTH = 600;
	const HEIGHT = 600;
	const TILE = 40;

	let canvas = $state<HTMLCanvasElement | null>(null);
	let ctx: CanvasRenderingContext2D | null = null;
	let img: ImageData | null = null;
	let raf = 0;

	// View into the complex plane: center (cx, cy) and units-per-pixel (scale).
	let view = { cx: -0.6, cy: 0, scale: 3.0 / WIDTH };

	let maxIter = $state(100);
	let step = $state(100);
	let showOwners = $state(false);
	let rendering = $state(false);
	let mode: 'single' | 'all' = $state('single');
	let progress = $state(0);
	let startTime = 0;
	let tSingle = $state<number | null>(null);
	let tAll = $state<number | null>(null);
	let zoom = $state(1);

	const workers = $derived(appState.workersMounted ? sched_num_workers() : 0);
	const speedup = $derived(tSingle && tAll ? tSingle / tAll : null);

	function ensureCtx() {
		if (!ctx && canvas) {
			ctx = canvas.getContext('2d');
			if (ctx) img = ctx.createImageData(WIDTH, HEIGHT);
		}
		return ctx;
	}

	function draw() {
		const c = ensureCtx();
		if (!c || !img) return;
		const buffer = (wasm_memory() as WebAssembly.Memory).buffer;
		const pixels = new Uint8ClampedArray(buffer, mandel_pixels_ptr(), WIDTH * HEIGHT * 4);
		img.data.set(pixels);
		c.putImageData(img, 0, 0);

		if (showOwners) {
			const total = mandel_tiles_total();
			const tilesX = mandel_tiles_x();
			const tile = mandel_tile();
			if (total > 0 && tilesX > 0 && tile > 0) {
				const owners = new Uint8Array(buffer, mandel_owner_ptr(), total);
				for (let ti = 0; ti < total; ti++) {
					const id = owners[ti];
					if (id === 255) continue; // still pending
					const ox = (ti % tilesX) * tile;
					const oy = Math.floor(ti / tilesX) * tile;
					c.fillStyle =
						id === 254 ? 'rgba(140,140,140,0.32)' : `hsla(${(id * 53) % 360}, 90%, 55%, 0.38)`;
					c.fillRect(ox, oy, tile, tile);
				}
			}
		}
	}

	function frame() {
		draw();
		const total = mandel_tiles_total();
		const done = mandel_tiles_done();
		progress = total ? done / total : 0;
		if (rendering && total > 0 && done >= total) {
			rendering = false;
			const elapsed = performance.now() - startTime;
			if (mode === 'single') tSingle = elapsed;
			else tAll = elapsed;
			draw();
			return;
		}
		raf = requestAnimationFrame(frame);
	}

	function render() {
		if (!appState.workersMounted) return;
		cancelAnimationFrame(raf);
		rendering = true;
		startTime = performance.now();
		mandel_render(WIDTH, HEIGHT, TILE, view.cx, view.cy, view.scale, maxIter, mode === 'single');
		raf = requestAnimationFrame(frame);
	}

	function onCanvasClick(e: MouseEvent) {
		if (!canvas || rendering) return;
		const rect = canvas.getBoundingClientRect();
		const px = (e.clientX - rect.left) * (WIDTH / rect.width);
		const py = (e.clientY - rect.top) * (HEIGHT / rect.height);
		view = {
			cx: view.cx + (px - WIDTH / 2) * view.scale,
			cy: view.cy + (py - HEIGHT / 2) * view.scale,
			scale: view.scale * 0.5
		};
		zoom *= 2;
		// Re-run in whatever mode was last used (default to the full pool).
		render();
	}

	function reset() {
		view = { cx: -0.6, cy: 0, scale: 3.0 / WIDTH };
		zoom = 1;
		tSingle = null;
		tAll = null;
		render();
	}

	$effect(() => {
		showOwners;
		if (!rendering && ctx) draw();
	});

	onDestroy(() => {
		if (raf) cancelAnimationFrame(raf);
	});
</script>

<div class="not-prose my-8 flex flex-col gap-4">
	<div class="grid gap-4 md:grid-cols-[600px_1fr]">
		<div class="relative">
			<canvas
				bind:this={canvas}
				width={WIDTH}
				height={HEIGHT}
				onclick={onCanvasClick}
				class="w-full max-w-150 cursor-crosshair rounded-lg border border-surface-500/30 bg-surface-900"
				title="Click to zoom in"
			></canvas>
			{#if rendering}
				<div
					class="absolute bottom-0 left-0 h-1 bg-primary-500 transition-[width] duration-100"
					style="width: {progress * 100}%"
				></div>
			{/if}
		</div>

		<div class="flex flex-col gap-4">
			<div class="flex flex-wrap gap-2">
				<button
					class="btn preset-filled"
					disabled={!appState.workersMounted || rendering}
					onclick={() => {
						mode = 'single';
						render();
					}}
				>
					Render on 1 thread
				</button>
				<button
					class="btn preset-filled"
					disabled={!appState.workersMounted || rendering}
					onclick={() => {
						mode = 'all';
						render();
					}}
				>
					Render on {workers || 'all'} threads
				</button>
			</div>

			<div class="flex flex-wrap items-end gap-4 text-sm">
				<label class="flex flex-col gap-1">
					<span>Max iterations</span>
					<input
						type="number"
						min={0}
						{step}
						bind:value={maxIter}
						oninput={() => render()}
						class="w-24 rounded border border-surface-500/30 bg-transparent px-2 py-1 font-mono"
					/>
				</label>
				<label class="flex flex-col gap-1">
					<span>Step by</span>
					<input
						type="number"
						min={1}
						step={1}
						bind:value={step}
						class="w-20 rounded border border-surface-500/30 bg-transparent px-2 py-1 font-mono"
					/>
				</label>
			</div>

			<label class="flex items-center gap-2 text-sm">
				<input type="checkbox" bind:checked={showOwners} />
				<span>Tint each tile by the worker that drew it</span>
			</label>

			<div class="flex flex-wrap gap-2 text-sm">
				<span class="self-center opacity-70">Zoom: {zoom}×</span>
			</div>

			<div class="mt-2 rounded-lg border border-surface-500/30 p-3 text-sm">
				<div class="flex justify-between">
					<span>1 thread</span>
					<span class="font-mono">{tSingle ? `${tSingle.toFixed(0)} ms` : '–'}</span>
				</div>
				<div class="flex justify-between">
					<span>{workers || 'N'} threads</span>
					<span class="font-mono">{tAll ? `${tAll.toFixed(0)} ms` : '–'}</span>
				</div>
				{#if speedup}
					<div class="mt-1 flex justify-between border-t border-surface-500/30 pt-1 font-semibold">
						<span>Speedup</span>
						<span class="font-mono text-primary-500">{speedup.toFixed(1)}×</span>
					</div>
				{/if}
			</div>

			{#if !appState.workersMounted}
				<p class="text-sm opacity-70">Spinning up the worker pool…</p>
			{:else}
				<p class="text-xs opacity-60">
					Tip: render once on 1 thread, then on {workers}. Zooming will re-render on the last
					clicked setting.
				</p>
			{/if}

			<button class="btn preset-tonal" disabled={rendering} onclick={reset}>Reset view</button>
		</div>
	</div>
</div>
