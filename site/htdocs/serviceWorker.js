var offlineFundamentals = [
  '/',
   '/css/base.css',
  '/js/core.min.js'
];
var version = 'v1.0.1';


self.addEventListener('install', installer);
self.addEventListener('activate', activator);
self.addEventListener('fetch', fetcher);

function installer (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(version + 'fundamentals').then(prefill));

  function prefill (cache) {
    return cache.addAll(offlineFundamentals);
  }
}

function activator (e) {
  if ('clients' in self && clients.claim) { clients.claim(); }

  e.waitUntil(
    caches.keys().then(function (keys) {
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
}

function fetcher (e) {
  var request = e.request;
  if (request.method !== 'GET') {
    e.respondWith(fetch(request)); return;
  }

  var url = new URL(request.url);

  e.respondWith(caches.match(request).then(queriedCache));

  function queriedCache (cached) {
    var networked = fetch(request)
      .then(fetchedFromNetwork, unableToResolve)
      .catch(unableToResolve);
    return cached || networked;
  }

  function fetchedFromNetwork (response) {
    var clonedResponse = response.clone();
    caches.open(version + 'pages').then(function add (cache) {
      cache.put(request, clonedResponse);
    });
    return response;
  }

  function unableToResolve () {
    var accepts = request.headers.get('Accept');
    if (url.origin === location.origin && accepts.indexOf('application/json') !== -1) {
      return offlineView();
    }
    if (accepts.indexOf('image') !== -1) {
      if (url.host === 'www.gravatar.com') {
        return caches.match(mysteryMan);
      }
      return caches.match(rainbows);
    }
    if (url.origin === location.origin) {
      return caches.match('/offline');
    }
    return offlineResponse();
  }

  function offlineView () {
    var viewModel = {
      version: env('TAUNUS_VERSION'),
      model: { action: 'error/offline' }
    };
    var options = {
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' })
    };
    return new Response(JSON.stringify(viewModel), options);
  }

  function offlineResponse () {
    return new Response('', { status: 503, statusText: 'Service Unavailable' });
  }
}
