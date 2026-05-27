
[working-directory('website')]
dev:
    pnpm run dev --port 5180 --strictPort

resume:
    typst watch resume/resume.typ resume/"Daniel Gallups Resume.pdf"

[working-directory('website')]
wasm:
    RUSTUP_TOOLCHAIN=nightly cargo build --target wasm32-unknown-unknown --profile wasm_release -p website -Z build-std=std,panic_abort
    wasm-bindgen --target web --typescript --out-dir src/lib/wasm/pkg target/wasm32-unknown-unknown/wasm_release/website.wasm

[working-directory('website')]
wasm-dev:
    RUSTUP_TOOLCHAIN=nightly cargo build --target wasm32-unknown-unknown --profile wasm_dev -p website --features dev -Z build-std=std,panic_abort
    wasm-bindgen --target web --typescript --out-dir src/lib/wasm/pkg target/wasm32-unknown-unknown/wasm_dev/website.wasm

[working-directory('website')]
wasm-ci:
    RUSTUP_TOOLCHAIN=nightly cargo build --target wasm32-unknown-unknown -p website -Z build-std=std,panic_abort
    wasm-bindgen --target web --typescript --out-dir src/lib/wasm/pkg target/wasm32-unknown-unknown/debug/website.wasm
