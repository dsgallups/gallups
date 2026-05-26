<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	interface Props {
		name: string;
		banner?: string;
		description?: string;
		href: string;
	}

	let { name, banner, description, href }: Props = $props();

	let is_external = $derived(href.startsWith('http'));
	let host = $derived(is_external ? new URL(href).hostname.replace(/^www\./, '') : '');
</script>

<a
	{href}
	target={is_external ? '_blank' : '_self'}
	rel={is_external ? 'noopener noreferrer' : ''}
	class="card group preset-filled-surface-100-900 card-hover divide-surface-200-800 block divide-y overflow-hidden border-[1px] border-surface-200-800 text-inherit no-underline"
>
	<header>
		<img src={banner} class="aspect-[21/9] w-full object-cover" alt={name} />
	</header>
	<article class="space-y-1 p-3">
		<h3 class="font-[450] group-hover:underline">{name}</h3>
		<p class="line-clamp-2 text-sm opacity-60">{description}</p>
	</article>
	{#if host}
		<footer class="flex items-center justify-between gap-2 p-3">
			<small class="truncate opacity-60">{host}</small>
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="opacity-60"
				aria-hidden="true"
			>
				<path d="M7 7h10v10" />
				<path d="M7 17 17 7" />
			</svg>
		</footer>
	{/if}
</a>
