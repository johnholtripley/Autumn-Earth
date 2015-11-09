var version = 'v1.0.0';
var cacheVersionRoot = 'localCache';
var offlineURL = 'offline.html';

var primaryURLsToCache = [
    '/',
    '/images/autumn-earth.svg',
    '/css/base.css',
    '/js/core.min.js',
    '/offline.html',
    '/images/offline-fallback.jpg'
];

// won't delay installation of the Service Worker:
var secondaryURLSToCache = [
    '/fonts/ForoLig-webfont.woff2'
];

function updateStaticCache() {
    return caches.open(cacheVersionRoot + version)
        .then(function(cache) {
            cache.addAll(secondaryURLSToCache);
            return cache.addAll(primaryURLsToCache);
        });
};


self.addEventListener('install', function(event) {
    event.waitUntil(updateStaticCache());
});

// delete any out of date caches:
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys()
        .then(function(keys) {
            return Promise.all(keys
                .filter(function(key) {
                    return key.indexOf(version) !== 0;
                })
                .map(function(key) {
                    return caches.delete(key);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    var request = event.request;
    // Always fetch non-GET requests from the network
    if (request.method !== 'GET') {
        event.respondWith(
            fetch(request)
            .catch(function() {
                return caches.match('/offline.html');
            })
        );
        return;
    }
    // For HTML requests, try the network first, fall back to the cache, finally the offline page
    if (request.headers.get('Accept').indexOf('text/html') !== -1) {
        event.respondWith(
            fetch(request)
            .then(function(response) {
                // Add a copy of this page in the cache
                var copy = response.clone();
                caches.open(cacheVersionRoot + version)
                    .then(function(cache) {
                        cache.put(request, copy);
                    });
                return response;
            })
            .catch(function() {
                return caches.match(request)
                    .then(function(response) {
                        return response || caches.match('/offline.html');
                    })
            })
        );
        return;
    }
    // For non-HTML requests, look in the cache first, fall back to the network
    event.respondWith(
        caches.match(request)
        .then(function(response) {
            return response || fetch(request)
                .catch(function() {
                    // If the request is for an image, show the offline placeholder
                    if (request.headers.get('Accept').indexOf('image') !== -1) {
                        return new Response('<img src="/images/offline-fallback.jpg">', {
                            headers: {
                                'Content-Type': 'image/jpeg'
                            }
                        });
                    }
                });
        })
    );
});
