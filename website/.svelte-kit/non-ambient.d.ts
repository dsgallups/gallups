
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>
		};
		Pathname(): "/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/Pasted image 20250818052042.png" | "/Pasted image 20251109051548.png" | "/android-chrome-192x192.png" | "/android-chrome-512x512.png" | "/apple-touch-icon.png" | "/favicon-16x16.png" | "/favicon-32x32.png" | "/favicon.ico" | "/icons/arrow-left-nostem.svg" | "/icons/arrow-left.svg" | "/icons/external-link.svg" | "/resume/contact.svg" | "/robots.txt" | "/site.webmanifest" | "/thumbnails/bevy_gltf.png" | "/thumbnails/bolf.png" | "/thumbnails/github_banner.png" | "/thumbnails/horse.jpg" | "/thumbnails/life-analysis-old.png" | "/thumbnails/life-analysis.png" | "/thumbnails/not_found.png" | "/thumbnails/rogue_time.png" | "/thumbnails/tle.png" | "/thumbnails/tracing-wasm.png" | string & {};
	}
}