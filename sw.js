// Service Worker for Offline Support
const CACHE_NAME = 'salesforce-learning-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/trainer-panel-enhanced.css',
  '/css/analytics.css',
  '/css/gamification.css',
  '/css/personalized-paths.css',
  '/css/code-review-ai.css',
  '/css/tutor-dashboard.css',
  '/css/mobile-optimized.css',
  '/js/app.js',
  '/js/site-nav.js',
  '/js/academy-guard.js',
  '/js/dashboard-identity.js',
  '/js/analytics.js',
  '/js/gamification.js',
  '/js/personalized-paths.js',
  '/js/code-review-ai.js',
  '/js/tutor-dashboard.js',
  '/js/mobile-features.js',
  '/js/learning-records.js',
  '/js/floating-guide.js',
  '/assets/tomcodex-logo.svg',
  'https://cdn.tailwindcss.com'
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch assets from cache or network
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  if (event.request.mode === 'navigate' || requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request as it's a stream and can only be consumed once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response as it's a stream and can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Update service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background sync
self.addEventListener('sync', event => {
  if (event.tag === 'learning-data-sync') {
    event.waitUntil(syncLearningData());
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/assets/tomcodex-logo.svg',
    badge: '/assets/tomcodex-logo.svg',
    tag: 'salesforce-learning',
    renotify: true,
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Salesforce Learning', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Function to sync learning data
function syncLearningData() {
  // In a real implementation, this would fetch from IndexedDB and POST to server
  return Promise.resolve();
}

// Handle push subscription management
self.addEventListener('pushsubscriptionchange', event => {
  if (event.oldSubscription) {
    // In a real implementation, this would send the new subscription to the server
    console.log('Subscription changed:', event.newSubscription);
  }
});
