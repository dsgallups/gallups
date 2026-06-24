<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children?: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<article
	class="prose max-w-none prose-neutral dark:prose-invert
		prose-headings:font-[350] prose-headings:tracking-tight
		prose-h1:mb-8 prose-h1:text-3xl sm:prose-h1:text-4xl
		prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-xl sm:prose-h2:text-2xl
		prose-p:leading-relaxed
		prose-a:font-normal prose-a:underline-offset-2
		prose-code:rounded prose-code:bg-surface-500/15 prose-code:px-1.5 prose-code:py-0.5
		prose-code:font-normal prose-code:before:content-[''] prose-code:after:content-['']
		prose-pre:rounded-xl prose-pre:text-sm prose-pre:leading-relaxed
		[&_pre_code]:rounded-none [&_pre_code]:bg-transparent [&_pre_code]:p-0"
>
	<h1>{title}</h1>

	{@render children?.()}
</article>
