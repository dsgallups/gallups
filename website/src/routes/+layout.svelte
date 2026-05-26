<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import LightSwitch from '$lib/LightSwitch.svelte';
	import { onMount } from 'svelte';
	import { initAppState } from '$lib/utils.svelte';

	let { children } = $props();

	onMount(() => {
		initAppState();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<main class="mx-auto flex max-w-180 flex-col gap-8 px-4 py-6">
	<header class="flex items-center justify-between gap-4">
		<h1 class="text-xl font-[250] sm:text-2xl">Daniel Studdard Gallups</h1>

		<LightSwitch />
	</header>
	{@render children()}
</main>
