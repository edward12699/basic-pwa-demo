import { registerRoute } from 'workbox-routing';
import { precacheAndRoute } from 'workbox-precaching';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// 使用 precaching 处理所有的 `index.html` 和所有的静态资源（例如 JavaScript, CSS）。
//在构建过程中，Workbox 会替换 self.__WB_MANIFEST 为实际的预缓存清单数组，该数组包含了所有由 webpack 构建生成的资源的 URL 以及其对应的版本信息。
// 但是仅限webpack 打包设计到的js， 不涉及public的代码
let needCache = ["index.html", 'main1.js']
precacheAndRoute(needCache.concat(self.__WB_MANIFEST));

// 对 API 请求使用 NetworkFirst 策略，如果网络不可用，那么从缓存中获取。
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 分钟
      }),
    ],
  })
);

// 对 CDN 请求使用 StaleWhileRevalidate 策略，先从缓存中获取，然后后台更新缓存。
registerRoute(
  ({ url }) => url.origin.startsWith('https://cdn.example.com'),
  new StaleWhileRevalidate({
    cacheName: 'cdn-cache',
  })
);

// 对图片使用 CacheFirst 策略，并限制缓存数量。
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 天
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// 在离线状态下，通过 background sync 插件重试失败的 POST 请求。
const bgSyncPlugin = new BackgroundSyncPlugin('bgSync', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

registerRoute(
  /\/api\/.*\/*.json/,
  new NetworkFirst({
    cacheName: 'api-post-requests',
    plugins: [bgSyncPlugin],
  }),
  'POST'
);
