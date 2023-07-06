// ask for notify

function notifyMe() {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission()
  }
}

notifyMe()




if ('serviceWorker' in navigator) {
  async function registerSync() {
    // navigator.serviceWorker.ready 返回的 Promise 对象在以下情况下会被解析：
    //Service Worker 注册成功并完成安装。
    //Service Worker 进入激活状态。
    const swRegistration = await navigator.serviceWorker.ready;
    swRegistration.sync.register("send-message").then(v => { console.log('注册sync 成功') }).catch(e => { console.log('注册失败') });
    swRegistration.backgroundFetch.fetch(
      "download-svg",
      ["./icons/fire-earth-backend-fetch.svg"]
    ).then(e => { console.log('backgroundfetch success') }).catch(err => { console.log(err) });
    swRegistration.periodicSync.register("update-news", {
      // try to update every 10 s
      minInterval: 1000 * 60,
    }).then(() => {
      setTimeout(() => {
        swRegistration.periodicSync.unregister("update-news"); console.log('unregister update-news')
      }, 1000 * 180)
    });
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        registerSync()
        console.log('Service Worker registered:');
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data;

      if (type === 'load news') {
        console.log(data.message);
      }
    });
  });
}


