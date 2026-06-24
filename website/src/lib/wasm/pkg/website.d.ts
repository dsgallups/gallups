/* tslint:disable */
/* eslint-disable */

/**
 * The `Int32Array` word index of worker `id`'s notify futex, for JS `Atomics.waitAsync`.
 *
 * `id` crosses the JS boundary as a raw `u32`: real workers pass their index, the main loop passes
 * the [`MAIN_ID`] sentinel. Map it back to the right [`ThreadId`] before resolving the slot.
 */
export function __notify_index(id: number): number;

/**
 * Drain all currently-available work for this worker.
 *
 * **Non-blocking**: the worker never parks the thread here. The idle
 * wait lives in JS (`Atomics.waitAsync`), which keeps the event loop
 * alive so already-spawned futures and their JS callbacks keep progressing.
 *
 *
 * ## Order:
 * 1. pinned runnables woken from another worker
 * 2. pinned work newly placed on this worker
 * 3. one stealable task (local deque -> steal from a sibling -> global injector), polled one.
 *    on `Pending` a stealable task re-queues itself via its waker, so it may migrate to another
 *    worker; if more stealable work is locally available, we re-arm deferred to take it the following
 *    tick.
 *
 * Returns `false` to signal a shutdown (the JS loop should stop).
 *
 * ## WARNING
 *
 * **NEVER** call this from the main thread.
 */
export function __worker_drain(worker_id: number): boolean;

export function init_hooks(): void;

export function mandel_generation(): number;

export function mandel_height(): number;

export function mandel_owner_ptr(): number;

export function mandel_pixels_ptr(): number;

export function mandel_render(width: number, height: number, tile: number, cx: number, cy: number, scale: number, max_iter: number, single_thread: boolean): number;

export function mandel_tile(): number;

export function mandel_tiles_done(): number;

export function mandel_tiles_total(): number;

export function mandel_tiles_x(): number;

export function mandel_width(): number;

export function mount_workers(): void;

export function sched_idle(): number;

export function sched_loads(): Uint32Array;

export function sched_num_workers(): number;

export function sched_waiting(): number;

export function scheduler_inject(n: number, work: number): void;

export function unmount_workers(): void;

export function wasm_memory(): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly mount_workers: () => void;
    readonly unmount_workers: () => void;
    readonly mandel_generation: () => number;
    readonly mandel_height: () => number;
    readonly mandel_owner_ptr: () => number;
    readonly mandel_pixels_ptr: () => number;
    readonly mandel_render: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
    readonly mandel_tile: () => number;
    readonly mandel_tiles_done: () => number;
    readonly mandel_tiles_total: () => number;
    readonly mandel_tiles_x: () => number;
    readonly mandel_width: () => number;
    readonly wasm_memory: () => any;
    readonly sched_idle: () => number;
    readonly sched_loads: () => [number, number];
    readonly sched_num_workers: () => number;
    readonly sched_waiting: () => number;
    readonly scheduler_inject: (a: number, b: number) => void;
    readonly init_hooks: () => void;
    readonly __notify_index: (a: number) => number;
    readonly __worker_drain: (a: number) => number;
    readonly wasm_bindgen_f183f172ff9cbd62___convert__closures_____invoke___wasm_bindgen_f183f172ff9cbd62___JsValue______true_: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f183f172ff9cbd62___convert__closures_____invoke_______true_: (a: number, b: number) => void;
    readonly memory: WebAssembly.Memory;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_destroy_closure: (a: number, b: number) => void;
    readonly __wbindgen_thread_destroy: (a?: number, b?: number, c?: number) => void;
    readonly __wbindgen_start: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput, memory?: WebAssembly.Memory, thread_stack_size?: number }} module - Passing `SyncInitInput` directly is deprecated.
 * @param {WebAssembly.Memory} memory - Deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput, memory?: WebAssembly.Memory, thread_stack_size?: number } | SyncInitInput, memory?: WebAssembly.Memory): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput>, memory?: WebAssembly.Memory, thread_stack_size?: number }} module_or_path - Passing `InitInput` directly is deprecated.
 * @param {WebAssembly.Memory} memory - Deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput>, memory?: WebAssembly.Memory, thread_stack_size?: number } | InitInput | Promise<InitInput>, memory?: WebAssembly.Memory): Promise<InitOutput>;
