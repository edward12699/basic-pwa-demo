

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    navigator.serviceWorker.register('/service-worker.js')
    const registration = await navigator.serviceWorker.ready;

    Promise.resolve(registration).then(registration => {
      return registration.pushManager.getSubscription()
    }).then(async (subscription) => {
      if (subscription) {
        return subscription
      } else {
        const response = await fetch('./vapidPublicKey');
        const vapidPublicKey = await response.text();
        // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
        // in the subscribe, the browser create client key pairs
        // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
        // send notifications that don't have a visible effect for the user).
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      }
    }).then(subscription => {
      fetch('./register', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          subscription: subscription
        })
      })
      // 绑定onclick
      document.getElementById('doIt').onclick = function () {
        const delay = document.getElementById('notification-delay').value;
        const ttl = document.getElementById('notification-ttl').value;
        // Ask the server to send the client a notification (for testing purposes, in actual
        // applications the push notification is likely going to be generated by some event
        // in the server).
        fetch('./sendNotification', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            subscription: subscription,
            delay: delay,
            ttl: ttl,
          }),
        });
      };
    }).catch(error => {
      console.log('Service Worker registration failed:', error);
    });
  });
}



// click to send 



// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}