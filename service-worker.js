// service-worker.js
const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request);
      })
  );
});

// Register event listener for the 'push' event.
self.addEventListener('push', function (event) {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and body 'Alea iacta est'.
    self.registration.showNotification('ServiceWorker Cookbook', {
      body: 'push success ',
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    //clients.openWindow 只能在用户交互的结果下调用，比如在 'notificationclick' 或者 'push' 事件处理程序中。如果在没有用户交互的情况下调用，它将不会有任何效果。
    clients.openWindow("https://localhost:8000/")
  );
});
