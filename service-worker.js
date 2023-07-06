// service-worker.js
const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/main.js'
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
  console.log(3)
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

// sync
self.addEventListener("sync", (event) => {
  if (event.tag == "send-message") {
    event.waitUntil(showNotification());
  }
});

function showNotification() {
  if (Notification.permission == "granted") {
    self.registration.showNotification('you have recovered from offline', {
      icon: './icons/fire-earth.svg',
      body: "Buzz! Buzz!",
      vibrate: [100, 100, 200, 100, 200, 100, 200]
    }).then(v => { console.log('notification showed') }).catch(err => { console.log(0) });
    // control to only show 1 s
    setTimeout(() => {
      self.registration.getNotifications().then((notifications) => {
        notifications.forEach((notification) => {
          notification.close();
        });
      });
    }, 1000);
  }
}




// backgroundfetch
self.addEventListener("backgroundfetchsuccess", async (event) => {
  event.waitUntil((async () => {
    const registration = event.registration;
    const record = await registration.match('./icons/fire-earth-backend-fetch.svg');
    const response = await record.responseReady
    await saveRecordToDB(response);
    event.updateUI({ title: "Finished your download!" });
  })());
});
self.addEventListener("backgroundfetchfail", (e) => { console.log('backgroundfetchfail') })
self.addEventListener("backgroundfetchabort", (e) => { console.log('backgroundfetchabort') })
self.addEventListener("backgroundfetchclick", (e) => { console.log('backgroundfetchclick') })

const databaseName = 'pwd-db';
const objectStoreName = 'background-downloads';

function saveRecordToDB(response) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(databaseName, 1);

    // only triggered when db version changes
    openRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(objectStoreName)) {
        db.createObjectStore(objectStoreName, { keyPath: 'id' });
      }
    };

    openRequest.onsuccess = (event) => {
      const db = event.target.result;
      // deal with the pic stream 
      // in my practice ,i used a png, if you don't use a png ,you may not need these codes
      const stream = response.body
      const reader = stream.getReader();
      const chunks = [];
      reader.read().then(function processResult(result) {
        if (result.done) {
          const transaction = db.transaction(objectStoreName, 'readwrite');
          const objectStore = transaction.objectStore(objectStoreName);
          const blob = new Blob(chunks, { type: 'image/jpeg' });
          const data = { id: 'stream-data', blob };
          const saveRequest = objectStore.put(data);

          saveRequest.onsuccess = () => {
            resolve();
          };

          saveRequest.onerror = (error) => {
            reject(error);
          };

          transaction.oncomplete = () => {
            db.close();
          };
        } else {
          chunks.push(result.value);
          return reader.read().then(processResult);
        }
      });
    };

    openRequest.onerror = (error) => {
      reject(error);
    };
  });
}


self.addEventListener("periodicsync", (event) => {
  if (event.tag === "update-news") {
    console.log(1)
    event.waitUntil(updateNews());
  }
});

function updateNews() {
  const data = { message: 'loaded news from remote' };
  return self.clients.claim().then(() => { return self.clients.matchAll() }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: 'load news', data });
    });
  }).then(() => { console.log('News updated') });
  // 发送数据给原页面


}








