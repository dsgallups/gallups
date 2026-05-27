use tracing::{Level, info};
use tracing_subscriber::{Registry, layer::SubscriberExt};
use wasm_bindgen::prelude::*;

use crate::console_layer::ConsoleLayer;
mod console_layer;
mod utils;

#[wasm_bindgen]
extern "C" {

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn init_hooks() {
    tracing::subscriber::set_global_default(
        Registry::default().with(ConsoleLayer::new(Level::INFO)),
    )
    .unwrap();

    info!("IN INIT HOOKS");

    utils::set_panic_hook();
}
