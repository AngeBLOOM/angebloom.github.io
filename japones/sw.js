/* Kana no Michi — caché offline. Versión: japones-20260904-foyr */
const CACHE = "japones-20260904-foyr";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./favicon.svg",
              "./icon-180.png", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  const isFont = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req).then(r => { const cp = r.clone();
        caches.open(CACHE).then(c => c.put("./index.html", cp)); return r; })
        .catch(() => caches.match("./index.html").then(m => m || Response.error())));
    return;
  }
  if(url.origin !== location.origin && !isFont) return;
  e.respondWith(caches.match(req).then(hit => hit ||
    fetch(req).then(r => {
      if(r && (r.ok || r.type === "opaque")){ const cp = r.clone();
        caches.open(CACHE).then(c => c.put(req, cp)); }
      return r;
    }).catch(() => hit || Response.error())));
});
