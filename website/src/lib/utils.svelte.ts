import { browser } from '$app/environment';
import init, { init_hooks } from '$lib/wasm/pkg/website';
import wasmUrl from '$lib/wasm/pkg/website_bg.wasm?url';

export const appState: {
	darkMode: boolean | null;
	wasmHooked: boolean;
} = $state({
	darkMode: null,
	wasmHooked: false
});

export async function waitForWasm() {
	if (!browser || appState.wasmHooked) return;

	await init({ module_or_path: wasmUrl });

	if (!appState.wasmHooked) {
		appState.wasmHooked = true;
		init_hooks();
	}
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
