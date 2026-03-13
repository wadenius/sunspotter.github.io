// Namnet på din cache (uppdatera versionsnumret när du ändrar filer)
const CACHE_NAME = 'sunmap-v1';

// Filerna du vill cacha för offline-bruk
const urlsToCache = [
  '/',
  '/index.html',
  '/sunmap-logo.svg',
  // Lägg till eventuella andra bilder eller filer här om du har några
];

// Installera Service Workern och spara filer i cachen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Hantera nätverksförfrågningar
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Om filen finns i cachen, returnera den
        if (response) {
          return response;
        }
        // Annars, hämta från nätverket
        return fetch(event.request);
      }
    )
  );
});

// Aktivera Service Workern och rensa gamla cachar
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Ta bort gamla cachar som inte längre behövs
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
