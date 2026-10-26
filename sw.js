// Offline cache. Bump CACHE when you change any file so phones pick up the update.
const CACHE="hfr-v1";
const FILES=["./","index.html","css/style.css","js/app.js","js/logo.js","vendor/jspdf.umd.min.js","vendor/jspdf.plugin.autotable.min.js","assets/logo.png","assets/icon-192.png","assets/icon-512.png","manifest.json"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
