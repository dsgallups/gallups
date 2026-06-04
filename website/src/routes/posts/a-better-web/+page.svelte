<script lang="ts">
	import Post from '$lib/components/Post.svelte';
</script>

<Post title="A Better Web">
	<p>Don't we love webassembly?</p>
	<p>I do.</p>

	<p>I want to show you something. Let's see if we can spawn some worker threads!</p>

	<div class="flex items-center justify-center">
		<button class="btn preset-filled">Spawn some threads!</button>
	</div>

	<h2 class="h2">How?</h2>

	<ol>
		<li>Enable the necessary rust flags in <code class="code">Cargo.toml</code></li>
		<li>Add our <code class="code">webworker.js</code> code</li>
	</ol>

	<p>To do this, you need, in your <code class="code">Cargo.toml</code>:</p>
	<code class="prose-code">
		<pre>
[target.wasm32-unknown-unknown]
rustflags = [
  "-Ctarget-feature=+atomics,+bulk-memory,+mutable-globals",
  "-Clink-arg=--shared-memory",
  "-Clink-arg=--import-memory",
  "-Clink-arg=--max-memory=1073741824",
  "-Clink-arg=--export=__wasm_init_tls",
  "-Clink-arg=--export=__tls_size",
  "-Clink-arg=--export=__tls_align",
  "-Clink-arg=--export=__tls_base",
  "-Clink-arg=--export=__heap_base",
  "--cfg",
  "getrandom_backend=\"wasm_js\"",
  "--cfg=web_sys_unstable_apis"
]

[unstable]
build-std = ["std", "panic_abort"]
</pre>
	</code>
	<p>But why?</p>
	<p>Why do we need</p>

	<h2 class="h2">Working around Drawbacks</h2>
	<p>
		We have mentioned the issue of the JS Shim, and how it's different from that of the shared
		memory module. That it's literally an index into a slab that's a pointer into actual JS... So
		let's do this: Let's
	</p>

	<h2 class="h2">Async Rust polling vs the Browser Microtick Scheduler</h2>
</Post>
