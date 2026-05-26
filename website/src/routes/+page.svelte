<script>
	import { SiBluesky, SiGithub } from '@icons-pack/svelte-simple-icons';
	import ProjCard from './ProjCard.svelte';
	import Section from './Section.svelte';
	import SocialLink from './SocialLink.svelte';
</script>

<div class="flex flex-col gap-8">
	<div class="-ml-2 flex gap-1">
		<!-- TODO: replace # with your real Bluesky profile URL -->
		<SocialLink href="https://bsky.app/profile/dsgallups.bsky.social" label="Bluesky">
			<SiBluesky size={20} />
		</SocialLink>
		<!-- TODO: replace # with your real LinkedIn profile URL -->
		<SocialLink href="https://www.linkedin.com/in/daniel-gallups/" label="LinkedIn">
			<!-- Simple Icons omits the LinkedIn logo (brand-guideline restriction), so this is the official mark inlined. -->
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path
					d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
				/>
			</svg>
		</SocialLink>
		<SocialLink href="https://github.com/dsgallups" label="GitHub">
			<SiGithub size={20} />
		</SocialLink>
		<!-- <SocialLink href="#" label="Peacher">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="10" />
				<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
				<path d="M2 12h20" />
			</svg>
		</SocialLink> -->
	</div>
	<Section title="Open Source">
		<div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-3">
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
</div>
