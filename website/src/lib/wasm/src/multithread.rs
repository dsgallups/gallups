use wasm_bindgen::prelude::*;

/// This is the entry point for starting the webworker.
/// This thread will await sync/async work.
#[wasm_bindgen]
pub fn worker_step(worker_id: u32) -> JsValue {
    todo!()
}
