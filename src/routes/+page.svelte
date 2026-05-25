<script>
	import ProjCard from './ProjCard.svelte';
	import Section from './Section.svelte';
</script>

<h1>Welcome to SvelteKit</h1>
<p>
	Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
</p>

<Section title="Posts" />
<Section title="Open Source">
	<ProjCard
		name="midix"
		href="https://github.com/RustMIDI/midix"
		banner="/thumbnails/github_banner.png"
		description="A more convenient MIDI parser"
	/>
</Section>
<Section title="Work" />
