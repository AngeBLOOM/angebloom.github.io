/* Kana no Michi — caché offline. Versión: japones-20261026-yduu */
const CACHE = "japones-20261026-yduu";
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
  /* las páginas de cada tema (/tonos/, /alfabeto/…) son otras páginas:
     ni se guardan como si fueran el curso ni se sirven desde la caché */
  const raiz = new URL("./", self.location).pathname;
  if(req.mode === "navigate" && url.pathname !== raiz && url.pathname !== raiz + "index.html") return;
  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req).then(r => { const cp = r.clone();
        caches.open(CACHE).then(c => c.put("./index.html", cp)); return r; })
        .catch(() => caches.match("./index.html").then(m => m || Response.error())));
    return;
  }
  if(url.origin !== location.origin && !isFont) return;
  /* el audio va aparte: el reproductor pide trozos (Range) y Safari no toca
     un fichero si le llega entero, así que se guarda entero y se sirve el
     trozo pedido. Sin esto el fichero fallaba y entraba la voz vieja. */
  if(/\/audio\/[^/]+\.mp3$/.test(url.pathname)){ e.respondWith(audioDe(req, url.href)); return; }
  e.respondWith(caches.match(req).then(hit => hit ||
    fetch(req).then(r => {
      if(r && (r.ok || r.type === "opaque")){ const cp = r.clone();
        caches.open(CACHE).then(c => c.put(req, cp)); }
      return r;
    }).catch(() => hit || Response.error())));
});
async function audioDe(req, href){
  const cache = await caches.open(CACHE);
  let r = await cache.match(href);
  if(!r){
    try{ r = await fetch(href); }catch(e){ return Response.error(); }
    if(!r.ok) return r;
    await cache.put(href, r.clone());
  }
  const rango = req.headers.get("range");
  if(!rango) return r;
  const datos = await r.arrayBuffer(), n = datos.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(rango) || [];
  const ini = m[1] ? +m[1] : 0, fin = m[2] ? Math.min(+m[2], n - 1) : n - 1;
  return new Response(datos.slice(ini, fin + 1), {status:206, headers:{
    "Content-Type":"audio/mpeg", "Content-Length":String(fin - ini + 1),
    "Content-Range":"bytes " + ini + "-" + fin + "/" + n, "Accept-Ranges":"bytes"}});
}
