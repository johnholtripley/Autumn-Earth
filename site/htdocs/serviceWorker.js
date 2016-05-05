'use strict';

// thanks to @adactio - https://adactio.com/journal/9888

(function() {

// the version number is updated in the Gulp cacheBusting task: 
    var version = 'v::144::';
    var staticCacheName = version + 'static';
    var pagesCacheName = version + 'pages';
    var imagesCacheName = version + 'images';
    var assetsCacheName = version + 'assets';
    var fallBackImage = '/images/offline-fallback.jpg';

    var updateStaticCache = function() {
        return caches.open(staticCacheName)
            .then(function(cache) {
                // These items won't block the installation of the Service Worker
                cache.addAll([
                    '/chronicle/'
                ]);
                // These items must be cached for the Service Worker to complete installation
                return cache.addAll([
                    '/',
                    '/images/autumn-earth.svg',
                    '/css/base.css',
                    '/js/core.min.js',
                    '/offline/',
                    fallBackImage
                ]);
            });
    };

    var stashInCache = function(cacheName, request, response) {
        caches.open(cacheName)
            .then(function(cache) {
                cache.put(request, response);
            });
    };

    // Limit the number of items in a specified cache.
    var trimCache = function(cacheName, maxItems) {
        caches.open(cacheName)
            .then(function(cache) {
                cache.keys()
                    .then(function(keys) {
                        if (keys.length > maxItems) {
                            cache.delete(keys[0])
                                .then(trimCache(cacheName, maxItems));
                        }
                    });
            });
    };

    // Remove caches whose name is no longer valid
    var clearOldCaches = function() {
        return caches.keys()
            .then(function(keys) {
                return Promise.all(keys
                    .filter(function(key) {
                        return key.indexOf(version) !== 0;
                    })
                    .map(function(key) {
                        return caches.delete(key);
                    })
                );
            });
    };

    self.addEventListener('install', function(event) {
        event.waitUntil(updateStaticCache()
            .then(function() {
                return self.skipWaiting();
            })
        );
    });

    self.addEventListener('activate', function(event) {
        event.waitUntil(clearOldCaches()
            .then(function() {
                return self.clients.claim();
            })
        );
    });

    self.addEventListener('message', function(event) {
        if (event.data.command == 'trimCaches') {
            trimCache(pagesCacheName, 20);
            trimCache(imagesCacheName, 30);
            trimCache(assetsCacheName, 10);
        }
    });

    self.addEventListener('fetch', function(event) {
        var request = event.request;
        var url = new URL(request.url);




        // Only deal with requests to my own server
        if (url.origin !== location.origin) {
            return;
        }


        // For non-GET requests, try the network first, fall back to the offline page
        if (request.method !== 'GET') {
            event.respondWith(
                fetch(request)
                .catch(function() {
                    return caches.match('/offline/');
                })
            );
            return;
        }

        // For HTML requests, try the network first, fall back to the cache, finally the offline page
        if (request.headers.get('Accept').indexOf('text/html') !== -1) {
            // handle re-directs to work around the Chrome bug: https://adactio.com/journal/10204
            request = new Request(url, {
                method: 'GET',
                headers: request.headers,
                mode: request.mode,
                credentials: request.credentials,
                redirect: request.redirect
            });
            event.respondWith(
                fetch(request)
                .then(function(response) {
                    // NETWORK
                    // Stash a copy of this page in the pages cache
                    var copy = response.clone();
                    stashInCache(pagesCacheName, request, copy);
                    return response;
                })
                .catch(function() {
                    // CACHE or FALLBACK
                    return caches.match(request)
                        .then(function(response) {
                            return response || caches.match('/offline/');
                        });
                })
            );
            return;
        }






        // For non-HTML requests, look in the cache first, fall back to the network
        event.respondWith(
            caches.match(request)
            .then(function(response) {
                // CACHE
                return response || fetch(request)
                    .then(function(response) {
                        // NETWORK
                        // If the request is for an image, stash a copy of this image in the images cache
                        if (request.headers.get('Accept').indexOf('image') !== -1) {
                            var copy = response.clone();
                            stashInCache(imagesCacheName, request, copy);
                        }
                        // check if it's js, css, or a font file and add it to the assets cache
                        if ((request.url.indexOf("/fonts/") !== -1) || (request.url.indexOf("/js/") !== -1) || (request.url.indexOf("/css/") !== -1)) {
                            // cache the font that's required by the browser:
                            var copy = response.clone();
                            stashInCache(assetsCacheName, request, copy);
                        }
                        return response;
                    })
                    .catch(function() {
                        // OFFLINE
                        // If the request is for an image, show an offline placeholder
                        if (request.headers.get('Accept').indexOf('image') !== -1) {
                            return caches.match(fallBackImage);
                        }
                    });
            })
        );
    });

}());
