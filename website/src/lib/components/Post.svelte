<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children?: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<article>
	<h1 class="mb-4 h2 font-[350]">{title}</h1>

	{@render children?.()}
</article>
