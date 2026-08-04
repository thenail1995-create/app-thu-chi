// sw.js — Service Worker CHỈ xử lý push + notificationclick.
// TUYỆT ĐỐI KHÔNG có fetch handler (không cache gì cả — tránh dính bản cũ / phục vụ nội dung cũ).

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {};
  }
  const title = data.title || 'Thu Chi Tiệm Thuê';
  const body = data.body || '';
  const url = data.url || 'https://thenail1995-create.github.io/app-thu-chi/';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      data: { url },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || 'https://thenail1995-create.github.io/app-thu-chi/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.indexOf(url) === 0 && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
