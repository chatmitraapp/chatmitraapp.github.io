
/* Mitra Service Worker: offline cache + Firebase Cloud Messaging */

const CACHE_NAME = "mitra-v5";

const FILES = [
  "./",
  "./index.html",
  "./login.html",
  "./manifest.json",
  "./mitra-icon-192.png?v=2",
  "./mitra-icon-512.png?v=2"
];

// Firebase SDK
importScripts(
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-messaging-compat.js"
);

// Firebase configuration
firebase.initializeApp({
  apiKey: "AIzaSyBymLPHlcfJWG1yenQH04KAv-Wig8NaEX8",
  authDomain: "mitra-e9a64.firebaseapp.com",
  projectId: "mitra-e9a64",
  storageBucket: "mitra-e9a64.firebasestorage.app",
  messagingSenderId: "1093452297580",
  appId: "1:1093452297580:web:fd04a5db2b60831a9daf49"
});

const messaging = firebase.messaging();

// Background notifications
messaging.onBackgroundMessage(payload => {
  const data = payload.data || {};

  const title =
    data.title ||
    payload.notification?.title ||
    "Mitra";

  const options = {
    body:
      data.body ||
      payload.notification?.body ||
      "You have a new message",

    icon: "./mitra-icon-192.png?v=2",
    badge: "./mitra-icon-192.png?v=2",

    data: {
      url: data.url || "./"
    },

    tag: data.chatId || "mitra-message",
    renotify: true
  };

  return self.registration.showNotification(title, options);
});

// Notification click
self.addEventListener("notificationclick", event => {
  event.notification.close();

  const target = new URL(
    event.notification.data?.url || "./",
    self.location.origin
  ).href;

  event.waitUntil((async () => {
    const windows = await clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of windows) {
      if ("focus" in client) {
        await client.focus();

        if ("navigate" in client) {
          await client.navigate(target);
        }

        return;
      }
    }

    if (clients.openWindow) {
      return clients.openWindow(target);
    }
  })());
});

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );

  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();

    await Promise.all(
      names
        .filter(name =>
          name.startsWith("mitra-") &&
          name !== CACHE_NAME
        )
        .map(name => caches.delete(name))
    );

    await self.clients.claim();
  })());
});

// Fetch
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});
