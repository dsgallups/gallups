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

export function mount_workers(): void;

export function unmount_workers(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly mount_workers: () => void;
    readonly unmount_workers: () => void;
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
