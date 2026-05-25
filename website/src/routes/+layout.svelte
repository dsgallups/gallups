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
<main class="container mx-auto max-w-180 py-3">
	<section class="flex items-center justify-between">
		<h1 class="text-2xl font-[250]">Daniel Studdard Gallups</h1>

		<LightSwitch />
	</section>
	{@render children()}
</main>
