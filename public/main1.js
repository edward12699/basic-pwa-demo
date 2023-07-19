// 在 sw.js 中：
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 在页面中：

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      // ...其他代码...

      // 如果有新的 Service Worker 安装完毕并处于等待状态，让它跳过等待直接接管页面。
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  });
}

