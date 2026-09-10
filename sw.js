const CACHE_NAME = 'notarium-cache-v2';
const APP_SHELL = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-512-maskable.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isAppShellFile = sameOrigin && (req.mode === 'navigate' || /\.(html|js|json)$/.test(url.pathname));

  if (isAppShellFile) {
    // App-Shell (index.html, manifest.json, sw.js-verwandte Dateien): IMMER zuerst versuchen,
    // die aktuelle Version aus dem Netz zu holen, damit ein neuer "git push" sofort sichtbar ist.
    // Nur wenn kein Netz verfuegbar ist (offline), wird die zuletzt zwischengespeicherte Version genutzt.
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
  } else if (sameOrigin) {
    // Andere lokale Dateien (Icons etc.): Cache-first genuegt, die aendern sich praktisch nie.
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(()=>{});
        return res;
      }))
    );
  } else {
    // Externe Ressourcen (Schriftarten, PDF-Bibliotheken): Network-first mit Cache-Fallback.
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match(req))
    );
  }
});
