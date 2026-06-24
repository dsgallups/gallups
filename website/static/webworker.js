// webwoke worker shim (ES module worker)
//
// Receives [WebAssembly.Module, WebAssembly.Memory, workerId] from the
// main thread, re-initialises wasm-bindgen against the shared memory,
// then runs the step loop.
//
// The loop calls __webwoke_worker_step which blocks (via Condvar /
// memory.atomic.wait32) until a task is available. Sync tasks execute
// inline; async tasks return a Promise that we `await`, yielding to the
// JS event loop so the future can make progress.

import init, { worker_step } from '/frontend_wasm.js';

self.onmessage = async ({ data }) => {
	const [module, memory, workerId] = data;
	// Re-initialise wasm-bindgen in this Worker context.
	// `module` is the compiled WebAssembly.Module (shared, not re-compiled).
	// `memory` is the WebAssembly.Memory (backed by SharedArrayBuffer).
	await init({ module_or_path: module, memory });

	// Step loop: each call blocks until a task is available.
	// - null       → sync task done, loop immediately
	// - Promise    → async task, await it (yields to event loop)
	// - undefined  → shutdown, break
	while (true) {
		const result = __webwoke_worker_step(workerId);
		if (result === undefined) break;
		if (result instanceof Promise) {
			try { await result; }
			catch (e) { console.error(`[worker ${workerId}] async task error:`, e); }
		}
  }
  console.log(`[worker ${workerId}] is going offline!`);
};
