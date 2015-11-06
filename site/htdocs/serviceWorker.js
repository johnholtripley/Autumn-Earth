var version = 15;
var cacheVersionRoot = 'localCache';
var offlineURL = 'offline.html';

var URLsToCache = [
    '/',
    '/images/autumn-earth.svg',
    '/css/base.css',
    '/fonts/ForoLig-webfont.woff2',
    '/js/core.min.js'
];

self.addEventListener('install', function(event) {
    var offlineRequest = new Request(offlineURL);
    event.waitUntil(
        fetch(offlineRequest).then(function(response) {
            return caches.open(cacheVersionRoot + version).then(function(cache) {
                return cache.put(offlineRequest, response);
            }).then(function(cache) {
                return cache.addAll(URLsToCache);
            });
        })
    );
});

self.addEventListener('fetch', function(event) {
    // see if it's a request for an html page, and check for network errors and serve the offline page if any:
    if (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(event.request).catch(function(e) {
                return caches.open(cacheVersionRoot + version).then(function(cache) {
                    return cache.match(offlineURL);
                });
            })
        );
    } else {
        // check for cached assets, if not go to the network:
        event.respondWith(
            caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
        );
    }
});

self.addEventListener('activate', function(event) {
    // check for out of date caches and delete them:
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName == cacheVersionRoot + (version - 1)) {
                        return caches.delete(cacheName);
                    }
                }));
        }));
});
