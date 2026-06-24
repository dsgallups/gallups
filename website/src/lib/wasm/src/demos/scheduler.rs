use std::sync::atomic::{AtomicU64, Ordering};

use wasm_bindgen::prelude::*;

/// A sink so the optimizer can't delete the busy-work loop.
static SINK: AtomicU64 = AtomicU64::new(0);

#[wasm_bindgen]
pub fn scheduler_inject(n: u32, work: u32) {
    let iters = (work.max(1) as u64) * 2_000_000;
    for _ in 0..n {
        let _ = webble::spawn(move || {
            let mut acc = 0u64;
            for i in 0..iters {
                acc = acc.wrapping_add(i ^ acc.rotate_left(7));
            }
            SINK.fetch_add(acc, Ordering::Relaxed);
        });
    }
}

#[wasm_bindgen]
pub fn sched_num_workers() -> u32 {
    webble::num_workers() as u32
}

#[wasm_bindgen]
pub fn sched_loads() -> Vec<u32> {
    webble::worker_loads()
}

#[wasm_bindgen]
pub fn sched_idle() -> u32 {
    webble::idle_snapshot()
}

#[wasm_bindgen]
pub fn sched_waiting() -> u32 {
    webble::num_tasks_waiting() as u32
}
