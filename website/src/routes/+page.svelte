<script>
	import ProjCard from './ProjCard.svelte';
	import Section from './Section.svelte';
</script>

<h1>Welcome to SvelteKit</h1>
<p>
	Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
</p>

<div class="flex flex-col gap-4">
	<Section title="Posts" />
	<Section title="Open Source">
		<div class="grid grid-cols-[repeat(auto-fill,minmax(0,200px))] gap-4">
			<ProjCard
				name="MIDIx"
				href="https://github.com/RustMIDI/midix"
				banner="/thumbnails/github_banner.png"
				description="A more convenient MIDI parser"
			/>
			<ProjCard
				name="MIDIx Synth"
				href="https://github.com/RustMIDI/midix-synth"
				banner="/thumbnails/github_banner.png"
				description="A rewrite of rustysynth, compatible with MIDIx and bevy"
			/>
			<ProjCard
				name="Polynomial NEAT"
				href="https://github.com/dsgallups/polynomial-neat"
				banner="/thumbnails/github_banner.png"
				description="GPU-bound NEAT implementation with polynomial activations, symbolic algebra solver"
			/>
			<ProjCard
				name="WASM Tracing"
				href="https://github.com/dsgallups/wasm-tracing"
				banner="/thumbnails/tracing-wasm.png"
				description="A fork of tracing-wasm with additional features"
			/>
			<ProjCard
				name="Bevy GLTF Animation"
				href="https://github.com/dsgallups/bevy_gltf_animation"
				banner="/thumbnails/bevy_gltf.png"
				description="A bevy plugin to simplify animation of 3d models"
			/>
			<ProjCard
				name="Trotcast"
				href="https://docs.rs/trotcast/latest/trotcast/"
				banner="/thumbnails/horse.jpg"
				description="A no_std compatible sync mpmc broadcast channel"
			/>
			<ProjCard
				name="Rogue Time"
				href="https://dsgallups.itch.io/rogue-time"
				banner="/thumbnails/rogue_time.png"
				description="Our submission for the 2025 1-bit video game jam"
			/>
			<ProjCard
				name="Bolf"
				href="https://radifire.itch.io/bolf"
				banner="/thumbnails/bolf.png"
				description="Our submission for Bevy Jam 6"
			/>
			<ProjCard
				name="The Life Engine"
				href="https://github.com/dsgallups/the-life-engine-rust"
				banner="/thumbnails/tle.png"
				description="A rewrite of emergent garden's life engine in bevy"
			/>
		</div>
	</Section>
	<Section title="Work" />
</div>
