/* Hors ligne : on essaie toujours le réseau d'abord (pour avoir la dernière version), sinon la copie en cache. */
var CACHE="sante-cite-v1";
var FILES=["./","index.html","config.js","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}));self.skipWaiting();});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==CACHE}).map(function(x){return caches.delete(x)}))}));self.clients.claim();});
self.addEventListener("fetch",function(e){var u=new URL(e.request.url);
  if(e.request.method!=="GET")return;
  if(u.hostname.indexOf("supabase.co")>=0)return; /* jamais de cache pour la synchro */
  e.respondWith(fetch(e.request).then(function(r){if(r.ok&&(u.origin===location.origin||u.hostname.indexOf("jsdelivr")>=0||u.hostname.indexOf("gstatic")>=0||u.hostname.indexOf("googleapis")>=0)){var c=r.clone();caches.open(CACHE).then(function(ca){ca.put(e.request,c)});}return r;})
    .catch(function(){return caches.match(e.request).then(function(r){return r||caches.match("index.html")})}));});
