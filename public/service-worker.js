var cacheName = 'votex-v0.0.1';
var dataCacheName = 'votexdata-v0.0.1';
var filesToCache = [
	'bower_components/angular-material/angular-material.min.css',
	'style/votex.css',
	'http://fonts.googleapis.com/icon?family=Material+Icons',
	'bower_components/angular/angular.min.js',
	'bower_components/angular-animate/angular-animate.min.js',
	'bower_components/angular-route/angular-route.min.js',
	'bower_components/angular-aria/angular-aria.min.js',
	'bower_components/angular-messages/angular-messages.min.js',
	'bower_components/angular-material/angular-material.min.js',
	'bower_components/angular-material-icons/angular-material-icons.min.js',
	'bower_components/async/dist/async.min.js',
	'bower_components/lodash/dist/lodash.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js',
	'bower_components/angular-chart.js/dist/angular-chart.min.js',
	'app.js',
	'service-worker.js',
	'./',
	'modules/pollings/pollings.js',
	'modules/totals/totals.js',
	'modules/check/check.js',
	'modules/help/help.js',
	'modules/simulation/simulation.js',
	'images/antena-64.png',
	'images/antena-128.png',
	'images/antena-256.png',
	'images/antena-512.png',
	'index.html',
	'modules/pollings/pollings.html',
	'modules/totals/totals.html',
	'modules/check/check.html',
	'modules/help/help.html',
	'modules/simulation/simulation.html'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});
self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  //var dataUrl = 'https://memu.herokuapp.com/';
  var dataUrl = 'http://localhost:8080/';
  if (e.request.url.indexOf(dataUrl) === 0) {
	e.respondWith(
	  fetch(e.request)
	    .then(function(response) {
	      return caches.open(dataCacheName).then(function(cache) {
	        cache.put(e.request.url, response.clone());
	        console.log('[ServiceWorker] Fetched&Cached Data');
	        return response;
	      });
	    })
	);
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
