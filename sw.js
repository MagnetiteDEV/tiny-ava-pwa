/* tiny-ava PWA v1.0.0 — service worker.
   App shell is precached on install. ONNX models (~29 MB) are NOT
   precached here: the TTS worker downloads them on first Speak /
   Download tap and keeps them in its own CacheStorage ("tiny-ava-v1"),
   so install stays fast and a failed model download never breaks install.
   This worker passes .onnx requests through untouched for that reason.
*/
const CACHE_NAME = "tiny-ava-pwa-v1.0.0";
const APP_SHELL = [
  "./",
  "index.html",
  "app.js",
  "worker.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "assets/tiny-ava-parisa.json",
  "vendor/ort/ort.wasm.min.js",
  "vendor/ort/ort-wasm-simd-threaded.mjs",
  "vendor/ort/ort-wasm-simd-threaded.wasm",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  // Let the TTS worker own .onnx caching (its own "tiny-ava-v1" cache).
  if (url.pathname.endsWith(".onnx")) return;

  if (event.request.mode === "navigate") {
    // Network-first for the entry page so updates reach the user,
    // with the cached shell as the offline fallback.
    event.respondWith(
      fetch(event.request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put("index.html", copy));
          return resp;
        })
        .catch(() => caches.match("index.html"))
    );
    return;
  }

  // Cache-first for everything else in the app shell.
  event.respondWith(
    caches.match(event.request).then(
      (hit) =>
        hit ||
        fetch(event.request).then((resp) => {
          if (resp.ok) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, copy));
          }
          return resp;
        })
    )
  );
});
