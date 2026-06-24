<script lang="ts">
	import { appState } from '$lib/utils.svelte';
	import {
		scheduler_inject,
		sched_num_workers,
		sched_loads,
		sched_idle,
		sched_waiting
	} from '$lib/wasm/pkg/website';
	import { onDestroy, onMount } from 'svelte';

	let workers = $state(0);
	let loads = $state<number[]>([]);
	let idleMask = $state(0);
	let waiting = $state(0);
	let raf = 0;

	let count = $state(240);
	let work = $state(6);

	const maxLoad = $derived(Math.max(6, ...loads));
	const busy = $derived(loads.filter((l) => l > 0).length);
	const parkedCount = $derived(
		Array.from({ length: workers }, (_, i) => (idleMask >> i) & 1).reduce((n, b) => n + b, 0)
	);

	function poll() {
		if (appState.workersMounted) {
			workers = sched_num_workers();
			loads = Array.from(sched_loads());
			idleMask = sched_idle();
			waiting = sched_waiting();
		}
		raf = requestAnimationFrame(poll);
	}

	function inject() {
		if (!appState.workersMounted) return;
		scheduler_inject(count, work);
	}

	function parked(i: number) {
		return ((idleMask >> i) & 1) === 1;
	}

	onMount(() => {
		raf = requestAnimationFrame(poll);
	});
	onDestroy(() => {
		if (raf) cancelAnimationFrame(raf);
	});
</script>

<div class="not-prose my-8 flex flex-col gap-4 rounded-lg border border-surface-500/30 p-4">
	<div class="flex flex-wrap items-end gap-4">
		<button class="btn preset-filled" disabled={!appState.workersMounted} onclick={inject}>
			Inject {count} tasks
		</button>
		<label class="flex flex-col gap-1 text-sm">
			<span>Tasks: <span class="font-mono">{count}</span></span>
			<input type="range" min="40" max="600" step="20" bind:value={count} />
		</label>
		<label class="flex flex-col gap-1 text-sm">
			<span>Work per task: <span class="font-mono">{work}</span></span>
			<input type="range" min="1" max="20" step="1" bind:value={work} />
		</label>
	</div>

	<div class="flex flex-wrap gap-4 text-sm">
		<span>Workers: <span class="font-mono">{workers}</span></span>
		<span>Running: <span class="font-mono text-primary-500">{busy}</span></span>
		<span>Parked: <span class="font-mono text-tertiary-500">{parkedCount}</span></span>
		<span>Queued (not yet running): <span class="font-mono">{waiting}</span></span>
	</div>

	<div class="flex items-end gap-2 overflow-x-auto pt-2" style="height: 160px">
		{#each loads as load, i (i)}
			<div class="flex h-full min-w-7 flex-1 flex-col items-center justify-end gap-1">
				<span class="font-mono text-xs opacity-70">{load}</span>
				<div class="flex w-full flex-1 items-end">
					<div
						class="w-full rounded-t transition-[height,background-color] duration-150 {parked(i)
							? 'bg-tertiary-500/40'
							: 'bg-primary-500'}"
						style="height: {Math.max(2, (load / maxLoad) * 100)}%"
						title="worker {i}: load {load}, {parked(i) ? 'parked' : 'running'}"
					></div>
				</div>
				<span class="font-mono text-[10px] opacity-50">w{i}</span>
			</div>
		{/each}
	</div>

	{#if !appState.workersMounted}
		<p class="text-sm opacity-70">Spinning up the worker pool…</p>
	{:else}
		<p class="text-xs opacity-60">
			Each bar is a real worker thread. Inject a burst and watch webble place tasks on the
			least-loaded worker (bars rise), drain them (bars fall), and park again (<span
				class="text-tertiary-500">dim</span
			>) once the queue is empty. The numbers come straight from the runtime's own introspection,
			polled each frame.
		</p>
	{/if}
</div>
