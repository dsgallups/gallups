<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		label: string;
		children: Snippet;
	}

	let { href, label, children }: Props = $props();

	let is_external = $derived(href.startsWith('http'));
</script>

<a
	{href}
	aria-label={label}
	title={label}
	target={is_external ? '_blank' : '_self'}
	rel={is_external ? 'noopener noreferrer' : ''}
	class="flex size-9 items-center justify-center rounded text-inherit no-underline transition hover:preset-tonal"
>
	{@render children()}
</a>
