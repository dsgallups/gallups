pub mod mandelbrot;
pub mod scheduler;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn wasm_memory() -> JsValue {
    wasm_bindgen::memory()
}
