<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	let t = $state(0);
	let raf = 0;
	let lastFreeze = $state<number | null>(null);

	let _sink = 0;

	const FREEZE_MS = 1500;

	const pos = $derived(50 + 49 * Math.sin(t * 0.05));
	const hue = $derived((t * 5) % 360);

	function tick() {
		t += 1;
		raf = requestAnimationFrame(tick);
	}
	const MAGIC_X = 17360605834;
	function jank() {
		// Deliberately terrible work
		const start = performance.now();
		let x = 0;

		while (x < MAGIC_X) {
			x += Math.sqrt(x * 0.5 + 1) + Math.sin(x);

			console.log('x:', x);
		}
		_sink = x;
		lastFreeze = performance.now() - start;
	}

	onMount(() => {
		raf = requestAnimationFrame(tick);
	});
	onDestroy(() => {
		if (raf) cancelAnimationFrame(raf);
	});
</script>

<div
	class="not-prose my-4 flex max-w-md flex-col gap-3 rounded-lg border border-surface-500/30 p-3"
>
	<div class="flex flex-wrap items-center gap-3">
		<button class="btn preset-filled" onclick={jank}>Jank</button>
		<span class="text-sm opacity-70">watch the bar freeze mid-slide</span>
		{#if lastFreeze !== null}
			<span class="font-mono text-xs text-error-500"
				>froze the whole page for {lastFreeze.toFixed(0)}ms!!</span
			>
		{/if}
	</div>

	<div class="relative h-4 w-full overflow-hidden rounded-full bg-surface-500/20">
		<div
			class="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full shadow"
			style="left: {pos}%; background-color: hsl({hue} 90% 55%);"
		></div>
	</div>
</div>
