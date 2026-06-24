import { browser } from '$app/environment';
import init, { init_hooks, mount_workers, unmount_workers } from '$lib/wasm/pkg/website';
import wasmUrl from '$lib/wasm/pkg/website_bg.wasm?url';

export const appState: {
	darkMode: boolean | null;
	wasmHooked: boolean;
	workersMounted: boolean;
} = $state({
	darkMode: null,
	wasmHooked: false,
	workersMounted: false
});

export async function waitForWasm() {
	if (!browser || appState.wasmHooked) return;

	await init({ module_or_path: wasmUrl });

	if (!appState.wasmHooked) {
		appState.wasmHooked = true;
		init_hooks();
	}
}

/** Ensure wasm is initialized and the webble worker pool is running. Idempotent: webble panics
 *  on a double `init`, so the `workersMounted` flag guards against mounting twice. */
export async function mountWorkers() {
	if (!browser) return;
	await waitForWasm();
	if (!appState.workersMounted) {
		mount_workers();
		appState.workersMounted = true;
	}
}

/** Tear the worker pool down (e.g. on route teardown). */
export function unmountWorkers() {
	if (!browser || !appState.workersMounted) return;
	unmount_workers();
	appState.workersMounted = false;
}

export function initAppState() {
	if (!browser) return;
	const mode = localStorage.getItem('mode') || 'dark';
	appState.darkMode = mode === 'dark';
}

export function toggleDarkMode() {
	if (!browser) return;
	const mode = localStorage.getItem('mode') || 'dark';

	const newMode = mode === 'light' ? 'dark' : 'light';

	document.documentElement.setAttribute('data-mode', newMode);
	localStorage.setItem('mode', newMode);
	appState.darkMode = newMode === 'dark';
}
