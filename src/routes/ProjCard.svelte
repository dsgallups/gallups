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
</script>

<a
	{href}
	target={is_external ? '_blank' : '_self'}
	rel={is_external ? 'noopener noreferrer' : ''}
	class="flex grow basis-50 flex-col overflow-hidden rounded preset-outlined-primary-100-900 text-inherit no-underline shadow-sm hover:underline"
>
	<img src={banner} class="h-24 w-full overflow-hidden object-cover" alt={name} />
	<div class="flex justify-between">
		<div class="px-1 py-1 pb-1.5">
			<div class="">{name}</div>
			<div class="text-sm">{description}</div>
		</div>
	</div>
</a>
