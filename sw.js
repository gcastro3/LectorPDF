/* Service worker del Lector: funcionamiento sin conexión y "Compartir con Lector" (Android) */
const VERSION = "lector-v1";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./pdf.min.js",
  "./pdf.worker.min.js",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== "lector-fonts" && k !== "lector-shared").map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);

  // Archivo compartido desde otra app (Android)
  if (req.method === "POST" && url.pathname.endsWith("/share-target")) {
    e.respondWith((async () => {
      try {
        const form = await req.formData();
        const file = form.get("file");
        if (file) {
          const c = await caches.open("lector-shared");
          await c.put("./__shared-file", new Response(file, {
            headers: { "content-type": file.type || "application/octet-stream", "x-file-name": encodeURIComponent(file.name || "documento.pdf") }
          }));
        }
      } catch (err) {}
      return Response.redirect("./?compartido=1", 303);
    })());
    return;
  }

  if (req.method !== "GET") return;

  // Fuentes de Google: guardar en caché la primera vez
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open("lector-fonts").then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      try { const res = await fetch(req); if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }
      catch (err) { return new Response("", { status: 504 }); }
    }));
    return;
  }

  // Archivos propios: primero la caché; la página se actualiza en segundo plano
  if (url.origin === self.location.origin) {
    e.respondWith((async () => {
      const cache = await caches.open(VERSION);
      const isPage = req.mode === "navigate";
      const hit = await cache.match(isPage ? "./index.html" : req, { ignoreSearch: isPage });
      const net = fetch(req).then(res => {
        if (res.ok && !isPage) cache.put(req, res.clone());
        if (res.ok && isPage) cache.put("./index.html", res.clone());
        return res;
      }).catch(() => null);
      return hit || (await net) || new Response("Sin conexión", { status: 503 });
    })());
  }
});
