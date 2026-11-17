/* Service worker Du Lagon au Siam : fonctionne hors-ligne après la première visite. */
var V = "siam-v1";
var CORE = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "p01.webp", "p02.webp", "p03.webp", "p04.webp", "p05.webp", "p06.webp", "p07.webp", "p08.webp", "p09.webp", "p10.webp", "p11.webp", "p12.webp", "p13.webp", "p14.webp", "p15.webp", "p16.webp", "p17.webp", "p18.webp", "p19.webp", "p20.webp", "p21.webp", "p22.webp"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf("siam-") === 0 && k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET") return;
  var u = new URL(r.url);
  if (u.origin !== self.location.origin) return;
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(function (hit) {
    var net = fetch(r).then(function (res) {
      if (res && res.ok) { var cp = res.clone(); caches.open(V).then(function (c) { c.put(r, cp); }); }
      return res;
    }).catch(function () { return hit || (r.mode === "navigate" ? caches.match("index.html") : undefined); });
    return hit || net;
  }));
});
