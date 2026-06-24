
export function glue_url(path) {
	return self.location.origin + path;
}
export function make_worker_blob_url(glueUrl) {
	const script =
		'import init, { __worker_drain, __notify_index } from ' + JSON.stringify(glueUrl) + ';\n' +
		'self.onmessage = async ({ data }) => {\n' +
		'  const [module, memory, workerId] = data;\n' +
		'  const wasm = await init({ module_or_path: module, memory });\n' +
		'  const idx = __notify_index(workerId);\n' +
		'  while (true) {\n' +
		'	 const view = new Int32Array(wasm.memory.buffer);\n' +
		'	 const seen = Atomics.load(view, idx);\n' +
		'	 if (!__worker_drain(workerId)) break;\n' +
		'	 const r = Atomics.waitAsync(view, idx, seen);\n' +
		'	 if (r.async) { await r.value; }\n' +
		'  }\n' +
		'};\n';
	const blob = new Blob([script], { type: "text/javascript" });
	return URL.createObjectURL(blob);
}
