<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<main class="container mx-auto">
	<h1 class="text-2xl font-[250]">Daniel Studdard Gallups</h1>
	{@render children()}
</main>
