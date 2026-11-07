/* Cotiza CL: guarda la app en el teléfono para que abra sin internet */
var CACHE = 'cotiza-cl-1fb45fb36b';
var ARCHIVOS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "LEEME.txt",
  "fonts/figtree-latin-400-normal.woff2",
  "fonts/figtree-latin-500-normal.woff2",
  "fonts/figtree-latin-600-normal.woff2",
  "fonts/figtree-latin-700-normal.woff2",
  "fonts/plus-jakarta-sans-latin-400-normal.woff2",
  "fonts/plus-jakarta-sans-latin-600-normal.woff2",
  "fonts/plus-jakarta-sans-latin-700-normal.woff2",
  "fonts/plus-jakarta-sans-latin-800-normal.woff2",
  "fonts/sora-latin-500-normal.woff2",
  "fonts/sora-latin-600-normal.woff2",
  "fonts/sora-latin-700-normal.woff2",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "vendor/fuentes-pdf.js",
  "vendor/jspdf.plugin.autotable.min.js",
  "vendor/jspdf.umd.min.js"
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('cotiza-cl-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (r) {
      var copia = r.clone();
      caches.open(CACHE).then(function (c) { c.put('./', copia); });
      return r;
    }).catch(function () { return caches.match('./').then(function (r) { return r || caches.match('index.html'); }); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (r) { return r || fetch(req); }));
});
