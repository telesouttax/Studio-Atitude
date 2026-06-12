importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBGn9LxTldEOMDuqoEY3Jxw0acmnCsmIQM",
  authDomain: "studio-atitude.firebaseapp.com",
  projectId: "studio-atitude",
  storageBucket: "studio-atitude.firebasestorage.app",
  messagingSenderId: "715112663622",
  appId: "1:715112663622:web:2ce104f5a4f8cd3739d847"
});

const messaging = firebase.messaging();

// Notificação em background (app fechado)
messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: icon || '/logo.png',
    badge: '/logo.png',
    vibrate: [200, 100, 200],
    data: payload.data
  });
});

// Ao clicar na notificação, abre o app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length) return list[0].focus();
      return clients.openWindow('/');
    })
  );
});

// Cache básico para PWA offline
const CACHE = 'sa-v1';
const ASSETS = ['/', '/index.html', '/logo.png', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
