var version = 4;
var cacheVersionRoot = 'localCache';

var URLsToCache = [
    '/',
    '/images/autumn-earth.svg',
    '/css/base.css',
    '/fonts/ForoLig-webfont.woff2',
    '/js/core.min.js'
];

function updateCache() {
    return caches.open(cacheVersionRoot + version)
        .then(function(cache) {
            return cache.addAll(URLsToCache);
        });
};

self.addEventListener('install', function(event) {
    event.waitUntil(updateCache());
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', function(event) {
  // check for out of date caches and delete them:
  event.waitUntil(
      caches.keys().then(function(cacheNames) {
          return Promise.all(
              cacheNames.map(function(cacheName) {
                  if (cacheName == cacheVersionRoot + (version - 1) {
                          return caches.delete(cacheName);
                      }
                  }));
          }));
  });
