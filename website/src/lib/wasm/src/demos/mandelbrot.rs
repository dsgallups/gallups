use std::sync::OnceLock;
use std::sync::atomic::{AtomicU8, AtomicU32, AtomicUsize, Ordering};

use wasm_bindgen::prelude::*;
use webble::worker::{ThreadId, thread_id};

const MAX_DIM: usize = 800;
const PIX_CAP: usize = MAX_DIM * MAX_DIM;
const TILE_CAP: usize = 4096;

const OWNER_PENDING: u8 = 255;
const OWNER_MAIN: u8 = 254;

struct Buffers {
    /// One packed `0xAABBGGRR` (little-endian RGBA) per pixel.
    pixels: Box<[AtomicU32]>,
    /// Worker id that computed each tile, or [`OWNER_PENDING`].
    owner: Box<[AtomicU8]>,
}

static BUF: OnceLock<Buffers> = OnceLock::new();

/// Bumped on every render. A task captures the generation it was spawned for and bails the
/// instant a newer render starts, so stale work can never scribble over a fresh frame.
static GENERATION: AtomicU32 = AtomicU32::new(0);
static TILES_DONE: AtomicUsize = AtomicUsize::new(0);
static TILES_TOTAL: AtomicUsize = AtomicUsize::new(0);

// Last render's geometry, mirrored for the JS side so it never has to recompute.
static LAST_W: AtomicU32 = AtomicU32::new(0);
static LAST_H: AtomicU32 = AtomicU32::new(0);
static LAST_TILE: AtomicU32 = AtomicU32::new(0);
static LAST_TILES_X: AtomicU32 = AtomicU32::new(0);

fn buffers() -> &'static Buffers {
    BUF.get_or_init(|| Buffers {
        pixels: (0..PIX_CAP).map(|_| AtomicU32::new(0xFF000000)).collect(),
        owner: (0..TILE_CAP)
            .map(|_| AtomicU8::new(OWNER_PENDING))
            .collect(),
    })
}

fn current_owner() -> u8 {
    match thread_id() {
        Some(ThreadId::Worker(w)) => w as u8,
        _ => OWNER_MAIN,
    }
}

/// Pack an escape-time result into a little-endian RGBA `u32`. Interior points are black and the
/// exterior uses a smooth cosine palette over the (fractional) iteration count.
fn color(iter: u32, max_iter: u32, mag2: f64) -> u32 {
    if iter >= max_iter {
        return 0xFF000000;
    }
    let smooth = iter as f64 + 1.0 - (0.5 * mag2.ln()).ln() / std::f64::consts::LN_2;
    let t = (smooth / max_iter as f64).clamp(0.0, 1.0);
    let phase = std::f64::consts::TAU * t;
    let r = (0.5 + 0.5 * (phase + 0.0).cos()) * 255.0;
    let g = (0.5 + 0.5 * (phase + 0.9).cos()) * 255.0;
    let b = (0.5 + 0.5 * (phase + 1.9).cos()) * 255.0;
    let (r, g, b) = (r as u32 & 0xFF, g as u32 & 0xFF, b as u32 & 0xFF);
    0xFF000000 | (b << 16) | (g << 8) | r
}

fn render_tile(
    bufs: &Buffers,
    width: usize,
    height: usize,
    x0: usize,
    y0: usize,
    x1: usize,
    y1: usize,
    cx: f64,
    cy: f64,
    scale: f64,
    max_iter: u32,
) {
    let half_w = width as f64 * 0.5;
    let half_h = height as f64 * 0.5;
    for py in y0..y1.min(height) {
        let c_im = cy + (py as f64 - half_h) * scale;
        let row = py * width;
        for px in x0..x1.min(width) {
            let c_re = cx + (px as f64 - half_w) * scale;
            let (mut zr, mut zi) = (0.0_f64, 0.0_f64);
            let mut iter = 0u32;
            let mut mag2 = 0.0;
            while iter < max_iter {
                let zr2 = zr * zr;
                let zi2 = zi * zi;
                mag2 = zr2 + zi2;
                if mag2 > 4.0 {
                    break;
                }
                zi = 2.0 * zr * zi + c_im;
                zr = zr2 - zi2 + c_re;
                iter += 1;
            }
            bufs.pixels[row + px].store(color(iter, max_iter, mag2.max(4.0)), Ordering::Relaxed);
        }
    }
}

#[wasm_bindgen]
pub fn mandel_render(
    width: u32,
    height: u32,
    tile: u32,
    cx: f64,
    cy: f64,
    scale: f64,
    max_iter: u32,
    single_thread: bool,
) -> u32 {
    let bufs = buffers();
    let w = (width as usize).min(MAX_DIM);
    let h = (height as usize).min(MAX_DIM);
    let tile = (tile.max(1) as usize).min(MAX_DIM);

    let tiles_x = w.div_ceil(tile);
    let tiles_y = h.div_ceil(tile);
    let num_tiles = (tiles_x * tiles_y).min(TILE_CAP);

    // Start a new generation and reset progress before any task can observe it.
    let generation = GENERATION.fetch_add(1, Ordering::AcqRel).wrapping_add(1);
    TILES_DONE.store(0, Ordering::Release);
    TILES_TOTAL.store(num_tiles, Ordering::Release);
    for ti in 0..num_tiles {
        bufs.owner[ti].store(OWNER_PENDING, Ordering::Relaxed);
    }
    LAST_W.store(w as u32, Ordering::Release);
    LAST_H.store(h as u32, Ordering::Release);
    LAST_TILE.store(tile as u32, Ordering::Release);
    LAST_TILES_X.store(tiles_x as u32, Ordering::Release);

    if single_thread {
        webble::spawn_stealable(async move {
            let bufs = buffers();
            let owner = current_owner();
            for ti in 0..num_tiles {
                if GENERATION.load(Ordering::Acquire) != generation {
                    return;
                }
                let (x0, y0) = ((ti % tiles_x) * tile, (ti / tiles_x) * tile);
                render_tile(
                    bufs,
                    w,
                    h,
                    x0,
                    y0,
                    x0 + tile,
                    y0 + tile,
                    cx,
                    cy,
                    scale,
                    max_iter,
                );
                bufs.owner[ti].store(owner, Ordering::Relaxed);
                TILES_DONE.fetch_add(1, Ordering::AcqRel);
            }
        });
    } else {
        for ti in 0..num_tiles {
            let (x0, y0) = ((ti % tiles_x) * tile, (ti / tiles_x) * tile);
            webble::spawn_stealable(async move {
                if GENERATION.load(Ordering::Acquire) != generation {
                    return;
                }
                let bufs = buffers();
                render_tile(
                    bufs,
                    w,
                    h,
                    x0,
                    y0,
                    x0 + tile,
                    y0 + tile,
                    cx,
                    cy,
                    scale,
                    max_iter,
                );
                bufs.owner[ti].store(current_owner(), Ordering::Relaxed);
                if GENERATION.load(Ordering::Acquire) == generation {
                    TILES_DONE.fetch_add(1, Ordering::AcqRel);
                }
            });
        }
    }

    generation
}

#[wasm_bindgen]
pub fn mandel_pixels_ptr() -> u32 {
    buffers().pixels.as_ptr() as u32
}

#[wasm_bindgen]
pub fn mandel_owner_ptr() -> u32 {
    buffers().owner.as_ptr() as u32
}

#[wasm_bindgen]
pub fn mandel_generation() -> u32 {
    GENERATION.load(Ordering::Acquire)
}

#[wasm_bindgen]
pub fn mandel_tiles_done() -> u32 {
    TILES_DONE.load(Ordering::Acquire) as u32
}

#[wasm_bindgen]
pub fn mandel_tiles_total() -> u32 {
    TILES_TOTAL.load(Ordering::Acquire) as u32
}

#[wasm_bindgen]
pub fn mandel_width() -> u32 {
    LAST_W.load(Ordering::Acquire)
}

#[wasm_bindgen]
pub fn mandel_height() -> u32 {
    LAST_H.load(Ordering::Acquire)
}

#[wasm_bindgen]
pub fn mandel_tile() -> u32 {
    LAST_TILE.load(Ordering::Acquire)
}

#[wasm_bindgen]
pub fn mandel_tiles_x() -> u32 {
    LAST_TILES_X.load(Ordering::Acquire)
}
