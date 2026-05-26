import { browser } from '$app/environment';

export const appState: {
	darkMode: boolean | null;
} = $state({
	darkMode: null
});

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
