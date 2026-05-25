<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children?: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<section class="flex flex-col gap-2">
	<h2 class="text-lg font-[350]">{title}</h2>

	{@render children?.()}
</section>
