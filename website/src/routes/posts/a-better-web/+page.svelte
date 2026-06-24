<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import JankButton from '$lib/components/demos/JankButton.svelte';
	import MandelbrotDemo from '$lib/components/demos/MandelbrotDemo.svelte';
	import SchedulerDemo from '$lib/components/demos/SchedulerDemo.svelte';
	import RuntimeDiagram from '$lib/components/demos/RuntimeDiagram.svelte';
	import { appState, mountWorkers, unmountWorkers } from '$lib/utils.svelte';
	import { onDestroy, onMount } from 'svelte';

	onMount(async () => {
		await mountWorkers();
	});

	onDestroy(() => {
		if (appState.workersMounted) {
			unmountWorkers();
		}
	});
</script>

<Post title="Webble: A Stepping Stone for a Better Web">
	<sub>June 24, 2026</sub>
	<p>Don't we love webassembly?</p>
	<p>I do.</p>

	<p>
		But look. There's some real goodies you get to come across when shipping Rust to the browser.
		The browser is, at its heart, a single-threaded engine. Your beautiful, fast, native-feeling
		ECMAScript (<a href="https://javascript.tm/" target="_blank" rel="noreferrer">JavaScript™</a>)
		runs on the same cpu core that paints the page, handles your click and runs the analytics script
		that somebody added. If your code is busy, everything else waits...
	</p>
	<p>
		But that's not to say that single-threaded sucker isn't fast. <a
			href="https://allabout.network/blogs/ddt/ai/the-billion-dollar-runtime-that-finally-got-my-attention"
			target="_blank"
			rel="noreferrer"><strong>a TON</strong> of money</a
		> was poured into the JavaScript™ V8 engine to make sure your cookie banner permissions run smoothly.
		But look: if you have more than one CPU core on your machine (which you do), shouldn't we be giving
		the other cores some love?
	</p>
	<figure class="not-prose my-8">
		<!-- Self-hosted so it survives the COOP/COEP cross-origin isolation the demos need. -->
		<video
			class="mx-auto w-full max-w-lg rounded-xl border border-surface-500/30"
			autoplay
			loop
			muted
			playsinline
		>
			<source src="/media/multithreading-breakdance.webm" type="video/webm" />
			<source src="/media/multithreading-breakdance.mp4" type="video/mp4" />
		</video>
		<figcaption class="mt-2 text-center text-xs opacity-60">
			Multithreading breakdance, via
			<a
				class="underline"
				href="https://tenor.com/view/multithreading-breakdance-dance-gif-4767038"
				target="_blank"
				rel="noreferrer">Tenor</a
			>
		</figcaption>
	</figure>

	<p>
		I had a bit of a problem with the single-threaded beast for an upcoming feature on <a
			href="https://peacher.app"
			target="_blank"
			rel="noreferrer">Peacher</a
		>, and in solving that problem, I built a <em>multithreaded</em>, <em>work-stealing</em>,
		<em>async</em>, <em><strong>rewritten-in-rust</strong></em>
		runtime called <strong>webble</strong>. While I finish cooking the peacher feature, I'd like to
		spend most of this post is me showing it off with real worker threads doing real work, live, on
		this page. But to explain why webble exists, I have to first explain why getting off that single
		dancing core has been such a long, strange road.
	</p>

	<h2>The main thread is sacred</h2>

	<p>
		A browser tab has one thread that matters: the main thread. It runs JavaScript™, it runs your
		WASM, it computes layout, it paints, and it dispatches every event. It does all of this by
		spinning an <em>event loop</em>: do a chunk of work, paint a frame, handle pending events,
		repeat. All of this work should happen ideally 60 times a second.
	</p>

	<p>
		So, what happens if you decide to do a lot of work that the main thread can't get out of? You
		get jank everyone can feel. Click the jank button for an example:
	</p>
	<JankButton />
	<p>
		If you sit in a tight loop for 200ms, the page can't paint and can't respond for 200ms. That's
		the jank everyone can feel. So the entire async model of the web, callbacks, promises,
		<code>async</code>/<code>await</code>, exists to let you give the thread back between bits of
		work instead of hogging it. (<a
			href="http://www.rossbencina.com/code/real-time-audio-programming-101-time-waits-for-nothing"
			target="_blank"
			rel="noreferrer">Audio devs know this pain all too well</a
		>)
	</p>

	<p>
		<code>async</code>/<code>await</code> is great for I/O, but is quite useless for actual
		computation. If you genuinely have a million things to add up, <code>await</code> doesn't make that
		faster, it just lets you feel bad about it more politely. For real parallelism you need real threads.
		And the web's relationship with threads is... complicated.
	</p>

	<h2>We've technically had threads for fifteen years</h2>

	<p>
		<a
			href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API"
			target="_blank"
			rel="noreferrer">Web Workers</a
		> shipped around 2009. A worker is a separate thread with its own JavaScript context, its own event
		loop, and crucially, its own memory. You talk to it by passing messages.
	</p>

	<p>
		By default, a worker shares nothing with you. When you <code>postMessage</code> an object, the
		browser <em>structured-clones</em> it: it serializes a deep copy across the thread boundary. Two workers
		can't poke at the same array. It's more like they mail each other photocopies. For a lot of workloads,
		the copying costs more than the work you were trying to parallelize, and you certainly can't build
		a shared scheduler or a lock on top of photocopies.
	</p>
	<p>
		What you actually want is shared memory: All the threads looking at the same photocopy in the
		same room. This implies a single buffer and real atomics. And the web did* get that (more on
		this later). It just took a security catastrophe and the better part of a decade to make it
		usable.
	</p>

	<h2>The SharedArrayBuffer saga</h2>

	<p>
		<a
			href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer"
			target="_blank"
			rel="noreferrer">SharedArrayBuffer</a
		>
		is the primitive that makes real threading possible. It is a chunk of memory that multiple threads
		can map at the same time, with
		<a
			href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics"
			target="_blank"
			rel="noreferrer">Atomics</a
		> and all that good stuff for safe concurrent access. Once this shipped, all was right in the world.
	</p>

	<p>
		Except, not for long. In January 2018, <a
			href="https://meltdownattack.com/"
			target="_blank"
			rel="noreferrer">Spectre</a
		>
		happened. Spectre is a CPU-level side-channel attack, and the ingredient it craves is a high-resolution
		timer. To skip a lot of jargon, a SharedArrayBuffer plus a counter incrementing in another thread
		is a fantastic high-resolution timer. So within weeks,
		<strong>every major browser disabled SharedArrayBuffer</strong>. Not all was right in the world.
	</p>

	<p>
		Eventually...it came back, on a leash. Around 2020, browsers re-enabled SharedArrayBuffer only
		for pages that opt into <strong>cross-origin isolation</strong>. You promise the browser, via
		two HTTP headers, that you aren't sharing a process with untrusted cross-origin content:
	</p>

	<pre><code
			>Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp</code
		></pre>

	<p>
		Send those, become <code>crossOriginIsolated</code>, and the browser hands SharedArrayBuffer
		back. (This very page sets them, which is the only reason the demos below run.) If you want the
		full story it's worth reading
		<a href="https://web.dev/articles/coop-coep" target="_blank" rel="noreferrer"
			>web.dev's COOP/COEP guide</a
		>
		and the original
		<a
			href="https://groups.google.com/a/chromium.org/g/blink-dev/c/1NKvbIj3dq4"
			target="_blank"
			rel="noreferrer">Chromium intent-to-ship</a
		>.
	</p>

	<h2>WebAssembly grew up</h2>

	<p>
		In parallel, WebAssembly was teaching itself to thread. The
		<a href="https://github.com/WebAssembly/threads" target="_blank" rel="noreferrer"
			>threads proposal</a
		>
		adds a <em>shared</em> linear memory and a set of atomic instructions, including
		<code>memory.atomic.wait</code>
		and <code>memory.atomic.notify</code>, the building blocks for locks and condition variables
		right in the WASM. It reached
		<a href="https://github.com/WebAssembly/proposals/issues/14" target="_blank" rel="noreferrer"
			>phase 4</a
		>, the last stop before becoming part of the core standard.
	</p>

	<p>
		And then it actually arrived. In September 2025, the
		<a href="https://webassembly.org/news/2025-09-17-wasm-3.0/" target="_blank" rel="noreferrer"
			>WebAssembly 3.0</a
		>
		spec was finished, folding threads and atomics (alongside 64-bit memory, garbage collection, SIMD,
		and exception handling) into the core language. YAY!
	</p>

	<p>
		So now, we have shared memory, we have atomics, we have workers to run threads on. Every piece
		is on the table. It's good for it.
	</p>

	<h2>So...does it still hurt to use?</h2>

	<p>It is, genuinely, still painful. Setting this up introduces a few sharp edges:</p>

	<ul>
		<li>
			<strong>The rust toolchain still fights you.</strong> Rust's standard library for WASM ships
			without thread support, so you need nightly and a
			<code>-Z build-std</code> rebuild of std with atomics enabled, plus a fistful of linker flags
			to import a shared memory. The
			<a href="https://github.com/RReverser/wasm-bindgen-rayon" target="_blank" rel="noreferrer"
				>wasm-bindgen-rayon</a
			>
			project and the wasm-bindgen
			<a
				href="https://rustwasm.github.io/docs/wasm-bindgen/examples/raytrace.html"
				target="_blank"
				rel="noreferrer">parallel raytracing example</a
			> both come with a page of incantations before anything runs, and webble is no different.
		</li>
		<li>
			<strong>The main thread can't <code>wait</code>.</strong> The natural way to make a thread
			sleep until there's work is <code>Atomics.wait</code>, but it's
			<em>blocking</em>, and blocking is forbidden on the main thread. The fix is
			<a
				href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/waitAsync"
				target="_blank"
				rel="noreferrer">Atomics.waitAsync</a
			>, a non-blocking variant that returns a promise and is safe on the main thread (see the
			<a href="https://v8.dev/features/atomics" target="_blank" rel="noreferrer">V8 writeup</a>).
			It's the right tool, but now you get to hand-write a futex-on-a-promise.
		</li>
		<li>
			<strong>Drawing off-thread is its own adventure.</strong>
			<a
				href="https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas"
				target="_blank"
				rel="noreferrer">OffscreenCanvas</a
			> lets a worker render, but you have to transfer canvas control across the thread boundary, support
			has historically been uneven, and coordinating who owns what gets fiddly fast.
		</li>
	</ul>

	<p>
		Given all of this, it's <em>not impossible</em>, it just takes a lot of plumbing, and the
		plumbing is the same every time. That's exactly the kind of thing a runtime should own so you
		don't have to.
	</p>

	<h2>Enter webble</h2>

	<p>
		<a href="https://crates.io/crates/webble" target="_blank" rel="noreferrer">webble</a> is a general-purpose
		async multithreaded runtime for the web. You run your Rust futures and closures across a pool of Web
		Workers that all share the WASM module's linear memory, real shared-memory threading, without blocking
		the main thread or the workers' event loops.
	</p>

	<p>
		The core idea is that there's exactly <em>one</em> runtime per module, because the scheduler
		itself lives in shared linear memory. Every worker maps the same module and the same memory, so
		every worker sees the same scheduling state at the same address. Spawning a task isn't a
		<code>postMessage</code> with a serialized payload, it's a push onto a queue that every thread can
		already see. It looks like this:
	</p>

	<RuntimeDiagram />

	<p>You initialize it once on the main thread, then spawn work through free functions:</p>

	<pre><code
			>// once, on the main thread:
webble::builder().glue_path("/my_app.js").init()?;

// a closure, run to completion on a worker:
let mut sum = webble::spawn(|| (0..1_000_000u64).sum::&lt;u64&gt;());

// an async fn built a worker, so the returned Future can be !Send:
let greeting = webble::spawn(|| async &#123;
    let local = std::rc::Rc::new("hello"); // !Send is fine here
    format!("&#123;local&#125; from a worker")
&#125;);

// CPU-heavy, load-balanced by work-stealing:
let handles: Vec&lt;_&gt; = (0..64)
    .map(|i| webble::spawn_stealable(async move &#123; expensive(i) &#125;))
    .collect();</code
		></pre>

	<p>There are two tracks, and the distinction is the whole game:</p>

	<ul>
		<li>
			<strong>Pinned</strong> (<code>webble::spawn</code>): placed on the least-loaded worker and
			owned by it forever. The future may be <code>!Send</code>, so you can hold an <code>Rc</code>
			or a <code>JsValue</code> across an
			<code>await</code>. This is often right default, as work-stealing has a decent amount of
			overhead.
		</li>
		<li>
			<strong>Stealable</strong> (<code>webble::spawn_stealable</code>): enters a work-stealing
			deque and may migrate between workers on every wake. The future must be
			<code>Send</code>, but you get automatic load balancing for CPU-heavy workloads.
		</li>
	</ul>

	<p>
		And because the main thread is a participant too, a worker can call
		<code>webble::on_main(...)</code> to run a closure back on the main thread (for DOM and other main-thread-only
		APIs) and await the result.
	</p>

	<h2>REAL threads doing REAL work</h2>

	<p>Alright, what I've been waiting to show you, some demos.</p>
	<p>
		Here's the scheduler, live. Every bar below is a real worker thread in <em>your</em> browser. Hit
		inject and watch webble place a burst of tasks on the least-loaded workers, drain them, and park the
		workers again when the queue empties. The numbers are read straight out of the runtime each frame,
		nothing is faked:
	</p>

	<SchedulerDemo />

	<p>
		The parked workers in this demo aren't spinning around. They're sleeping on an <code
			>Atomics.waitAsync</code
		>, costing nothing until a futex word in shared memory gets bumped and wakes one of them. That's
		the non-blocking-event-loop promise: even a parked worker keeps its event loop alive, so timers
		and <code>fetch</code> inside your tasks stil make progress.
	</p>

	<p>
		One of my favorite illustrations is the Mandelbrot set. I know, a bit on the nose for a
		multithreading demo, but it's quite a great stress test. Every pixel is an independent
		computation, and the pixels near the boundary are wildly more expensive than the ones far away.
		The image is chopped into tiles, and each tile is a webble task.
	</p>

	<p>
		Render it first on a single thread, then on your whole pool. It's all the same pixels and math,
		but the only difference is how many workers chew through the tiles. Then, turn on tile tinting:
		each tile is colored by the worker that drew it. Click the image to zoom into the boundary.
	</p>

	<MandelbrotDemo />

	<p>
		Note: the speedup isn't a perfect Nx. You're bounded by your core count, by the tiles that
		finish fast leaving a worker idle, and by the overhead of coordination. But, it's real
		parallelism. It's off the main thread (the page stays responsive the entire render), and the
		tinting shows work-stealing doing its job: when one worker gets stuck on a dense tile, the
		others steal the easy ones and keep moving.
	</p>

	<h2>How it works under the hood</h2>

	<p>A quick tour of the machinery, because the details are the fun part:</p>

	<ul>
		<li>
			<strong
				>The executor is <a href="https://docs.rs/async-task" target="_blank" rel="noreferrer"
					>async_task</a
				>.</strong
			>
			Each future becomes a <code>Runnable</code> raw pointer. Scheduling a woken task is just routing
			that pointer to the right worker's queue in shared memory.
		</li>
		<li>
			<strong>Wakeups are futexes.</strong> Every worker has a notify word. A producer bumps it and
			calls <code>memory.atomic.notify</code>; the worker, parked in
			<code>Atomics.waitAsync</code>, wakes and drains its queues on the microtask queue. There's a
			bitmask of parked workers so a producer can wake exactly one.
		</li>
		<li>
			<strong>Shutdown is a Dekker handshake.</strong> Each worker flips a
			<code>busy</code> flag while it's touching the shared work-stealing deques, and shutdown waits for
			every worker to reach a safe point before terminating it, so the shared structures (which get reused
			across restarts) never get corrupted mid-operation.
		</li>
	</ul>

	<p>
		The result is that "spawn a task" stays cheap no matter which thread you're on, and the runtime
		never has to block to coordinate.
	</p>

	<p>
		I should be clear that almost none of this scheduler design is original to me. webble's bones,
		the per-worker slots, the work-stealing deques, the trick of capping the pool at 32 so the
		parked set fits in a single atomic, are lifted from
		<a href="https://github.com/nthtensor/forte" target="_blank" rel="noreferrer">Forte</a>,
		nthtensor's low-overhead parallel and async work scheduler for native Rust. Forte's lazy
		heartbeat scheduling and its per-seat structure were the thing that convinced me a runtime like
		this could be both tiny and cheap, and chunks of webble are pretty much a port of its ideas
		across the wasm-and-workers boundary into the browser. If you do any parallel work in native
		Rust, go check it out. It's lovely.
	</p>

	<h2>Try it yourself</h2>

	<p>The setup is still a little fiddly (that's the web for you), but it's bounded. You need:</p>
	<p>Nightly rust and a <code>.cargo/config.toml</code> that rebuilds std with atomics:</p>

	<pre><code
			>[target.wasm32-unknown-unknown]
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
]

[unstable]
build-std = ["std", "panic_abort"]</code
		></pre>

	<p>
		A <code>--target web</code> wasm-bindgen build (the workers re-import your glue and
		re-initialize against the shared memory), the
		<code>Cross-Origin-Opener-Policy</code> and
		<code>Cross-Origin-Embedder-Policy</code> headers from earlier, and then one call to
		<code>webble::builder().init()</code>.
	</p>

	<p>
		webble is on <a href="https://crates.io/crates/webble" target="_blank" rel="noreferrer"
			>crates.io</a
		>
		and the source is on
		<a href="https://github.com/dsgallups/webble" target="_blank" rel="noreferrer">GitHub</a>. It's
		early, the API is still settling, and I'd genuinely love help. If you get stuck wiring it up, my
		Discord handle is <code>dsgallups</code>.
	</p>

	<p>
		The web has had real threads sitting in the toolbox for a while now. They were, and still are,
		buried under a decade of security history and a pile of build flags. And while I can't
		immediately fix the above annoyances, webble is my attempt to hand you a tool. Let me know what
		you think. To a more performant web!
	</p>
</Post>
