# tiny-ava PWA v1.0.0

Offline-installable Persian (Farsi) text-to-speech — Parisa voice.
Built from [mallahyari/tiny-ava](https://github.com/mallahyari/tiny-ava)
(commit d4bd268, 2026-11-23). The demo's TTS logic is unchanged; this
build only adds the PWA shell and vendors the ONNX Runtime Web files
locally so nothing is fetched from a CDN at runtime.

## What's inside

- `index.html`, `app.js`, `worker.js` — original demo (unchanged logic)
- `assets/` — ONNX models: `tiny-ava-parisa.onnx` (20.4 MB) +
  G2P encoder/decoder (8.4 MB) + `tiny-ava-parisa.json`
- `vendor/ort/` — onnxruntime-web 1.20.1, vendored locally:
  `ort.wasm.min.js`, `ort-wasm-simd-threaded.mjs`,
  `ort-wasm-simd-threaded.wasm` (11.2 MB)
- `manifest.webmanifest`, `sw.js`, `icons/icon-192.png`, `icons/icon-512.png`
- `serve_local.py` — local test server (http://127.0.0.1:8788)

Total on disk: ~40 MB (29 MB models + 11 MB ORT wasm + app shell).

## Install (phone)

1. Host this folder on HTTPS — easiest: GitHub Pages, Cloudflare Pages,
   Netlify Drop, or any static host. `file://` will NOT work for a PWA
   (service workers need http(s)).
2. Open the hosted URL **in the phone browser**:
   - Android (Chrome): ⋮ → "Install app" / "Add to Home screen"
   - iPhone (Safari): Share → "Add to Home Screen" — open in Safari,
     not in the Files preview (Files runs no JavaScript).
3. Open the app from the home screen, tap "Download models (~29 MB)"
   once (or just tap Speak). Models are cached on-device after that.
4. Afterwards it works fully offline — airplane mode included.
   Check the footer badge: **PWA v1.0.0**.

## Notes

- One voice (Parisa), Persian only. Speed / pitch / expressiveness
  sliders work as in the original demo; generated audio can be
  downloaded as WAV from the app.
- The service worker precaches only the app shell + ORT runtime.
  The 29 MB models are cached on demand by the TTS worker in its own
  cache (`tiny-ava-v1`), so install stays fast.
- "Remove from this browser" in the app clears the models; the PWA
  itself is removed like any app (long-press the icon → Uninstall/Remove).
- Updating: replace all files (including `sw.js`), bump the cache name
  in `sw.js` and the footer badge, then hard-refresh once.

## Licence / attribution

- Code: Apache-2.0 (original repo).
- Model weights: CC BY 4.0 — "Powered by tiny-ava (Mehdi Allahyari /
  OncillaAI)" + link to `mehdi-hf/tiny-ava` (kept in the app footer).
- Persian G2P: `mehdi-hf/persian-g2p-tiny` (MIT).
- Architecture built on `n4ze3m/tiny-voca` (Apache-2.0).
