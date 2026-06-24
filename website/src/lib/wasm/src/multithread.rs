use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn mount_workers() {
    webble::builder().glue_path("/frontend_wasm.js").init().unwrap();
}

#[wasm_bindgen]
pub fn unmount_workers() {
    webble::shutdown();
}
