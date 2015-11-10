


'use strict';

/*
To do:
add fonts when requested so only file type needed is added
gulp minify this without breaking it
*/


(function() {

    var staticCacheName = 'static';
    var version = 'v9::';
var fallBackImage = '/images/offline-fallback.jpg';

    function updateStaticCache() {
        return caches.open(version + staticCacheName)
            .then(function (cache) {
               
            
                // These items must be cached for the Service Worker to complete installation
                return cache.addAll([
                    '/',
    '/images/autumn-earth.svg',
    '/css/base.css',
    '/js/core.min.js',
    '/offline.html',
    fallBackImage
                ]);
            });
    };

    self.addEventListener('install', function (event) {
        event.waitUntil(updateStaticCache());
    });

    self.addEventListener('activate', function (event) {
        event.waitUntil(
            caches.keys()
                .then(function (keys) {
                    // Remove caches who's name in no longer valid
                    return Promise.all(keys
                        .filter(function (key) {
                          return key.indexOf(version) !== 0;
                        })
                        .map(function (key) {
                          return caches.delete(key);
                        })
                    );
                })
        );
    });

    self.addEventListener('fetch', function (event) {
        var request = event.request;
        // For non-GET requests, try the network first, fall back to the offline page
        if (request.method !== 'GET') {
            event.respondWith(
                fetch(request, { credentials: 'include' })
                    .catch(function () {
                        return caches.match('/offline.html');
                    })
            );
            return;
        }

        // For HTML requests, try the network first, fall back to the cache, finally the offline page
        if (request.headers.get('Accept').indexOf('text/html') !== -1) {
            event.respondWith(
                fetch(request, { credentials: 'include' })
                    .then(function (response) {
                        // Add a copy of this page in the cache
                        var copy = response.clone();
                        caches.open(version + staticCacheName)
                            .then(function (cache) {
                                cache.put(request, copy);
                            });
                        return response;
                    })
                    .catch(function () {
                        return caches.match(request)
                            .then(function (response) {
                                return response || caches.match('/offline.html');
                            })
                    })
            );
            return;
        }

        // For non-HTML requests, look in the cache first, fall back to the network
        event.respondWith(
            caches.match(request)
                .then(function (response) {
                    return response || fetch(request)
                     .then(function(response) {
                    if (request.url.indexOf("/fonts/") !== -1) {
                        var copy = response.clone();
                        caches.open(version + staticCacheName)
                            .then(function(cache) {
                                cache.put(request, copy);
                            });
                    }
              
                    return response;
                })
                        .catch(function () {
                            // If the request is for an image, show an offline placeholder
                            if (request.headers.get('Accept').indexOf('image') !== -1) {
                                return caches.match(fallBackImage);
                            }
                        });
                })
        );
    });

})();














