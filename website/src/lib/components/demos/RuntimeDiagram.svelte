<div class="not-prose my-8">
	<svg viewBox="0 0 720 360" class="w-full" role="img" aria-label="webble runtime architecture">
		<g class="text-primary-500">
			<rect
				x="40"
				y="24"
				width="640"
				height="64"
				rx="10"
				fill="currentColor"
				fill-opacity="0.08"
				stroke="currentColor"
				stroke-opacity="0.6"
			/>
			<text x="60" y="50" class="fill-current text-sm" font-size="15" font-weight="600">
				Main thread
			</text>
			<text x="60" y="72" class="fill-current" font-size="12" fill-opacity="0.8">
				event loop · DOM · on_main() work · never blocks (Atomics.waitAsync)
			</text>
		</g>

		{#each [0, 1, 2, 3] as i (i)}
			<g class="text-tertiary-500" transform="translate({40 + i * 165}, 130)">
				<rect
					width="150"
					height="58"
					rx="10"
					fill="currentColor"
					fill-opacity="0.08"
					stroke="currentColor"
					stroke-opacity="0.6"
				/>
				<text x="14" y="26" class="fill-current" font-size="13" font-weight="600">
					Worker {i}
				</text>
				<text x="14" y="46" class="fill-current" font-size="11" fill-opacity="0.8">
					parks in waitAsync
				</text>
			</g>
		{/each}

		{#each [0, 1, 2, 3] as i (i)}
			<line
				x1="360"
				y1="88"
				x2={115 + i * 165}
				y2="130"
				stroke="currentColor"
				stroke-opacity="0.35"
				stroke-width="1.5"
			/>
		{/each}

		<g class="text-surface-400">
			<rect
				x="40"
				y="232"
				width="640"
				height="96"
				rx="10"
				fill="currentColor"
				fill-opacity="0.12"
				stroke="currentColor"
				stroke-opacity="0.6"
				stroke-dasharray="5 4"
			/>
			<text x="60" y="258" class="fill-current" font-size="14" font-weight="600">
				Shared linear memory (SharedArrayBuffer)
			</text>
			<text x="60" y="282" class="fill-current" font-size="12" fill-opacity="0.85">
				one scheduler · per-worker slots · work-stealing deques · futex words
			</text>
			<text x="60" y="304" class="fill-current" font-size="12" fill-opacity="0.85">
				every worker sees the same state at the same address, so spawning is a queue push, not a
				postMessage
			</text>
		</g>

		{#each [0, 1, 2, 3] as i (i)}
			<line
				x1={115 + i * 165}
				y1="188"
				x2={115 + i * 165}
				y2="232"
				stroke="currentColor"
				stroke-opacity="0.35"
				stroke-width="1.5"
			/>
		{/each}
	</svg>
</div>
