self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // A very basic fetch handler for PWA installability.
  // In a real production app, you would implement proper caching strategies here.
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('You are offline. Please reconnect to use Focus.');
    })
  );
});
