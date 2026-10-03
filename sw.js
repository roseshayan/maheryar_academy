const CACHE_NAME = 'maheryar-cache-v1';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/fontiran.css',
  './assets/css/style.css',
  './assets/js/app.js',
  './assets/vendor/css/swiper-bundle.min.css',
  './assets/vendor/js/swiper-bundle.min.js',
  './assets/vendor/js/lucide.min.js',
  './assets/fonts/woff2/IRANSansX-Regular.woff2',
  './assets/fonts/woff2/IRANSansX-Bold.woff2',
  './assets/fonts/woff2/IRANSansX-Medium.woff2',
  './assets/fonts/woff2/IRANSansX-DemiBold.woff2',
  './assets/img/Logo.svg',
  './assets/img/Logo-Icon.svg',
  './assets/img/logo-irantvto.png',
  './assets/img/logo-neshan.png',
  './assets/img/logo-bale.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Precache partial fail:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests
  if (request.method !== 'GET') return;

  // Cache-first for fonts and images
  if (
    request.destination === 'font' ||
    request.destination === 'image' ||
    url.pathname.includes('/fonts/') ||
    url.pathname.includes('/img/')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Network-first for navigation and other assets
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
