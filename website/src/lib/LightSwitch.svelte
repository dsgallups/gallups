<script lang="ts">
	import { appState, toggleDarkMode } from '$lib/utils.svelte';

	let isDark = $derived(appState.darkMode === true);
	let isLoading = $derived(appState.darkMode === null);
</script>

<button
	type="button"
	onclick={toggleDarkMode}
	disabled={isLoading}
	aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
	title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
	class="inline-flex h-9 w-9 items-center justify-center rounded hover:preset-tonal disabled:opacity-50"
>
	{#if isDark}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="h-5 w-5"
			aria-hidden="true"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="h-5 w-5"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2" />
			<path d="M12 20v2" />
			<path d="m4.93 4.93 1.41 1.41" />
			<path d="m17.66 17.66 1.41 1.41" />
			<path d="M2 12h2" />
			<path d="M20 12h2" />
			<path d="m6.34 17.66-1.41 1.41" />
			<path d="m19.07 4.93-1.41 1.41" />
		</svg>
	{/if}
</button>
