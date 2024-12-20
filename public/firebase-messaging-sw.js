/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

self.addEventListener('fetch', () => {
  const urlParams = new URLSearchParams(location.search);
  self.firebaseConfig = Object.fromEntries(urlParams);
});

const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

firebase.initializeApp(self.firebaseConfig || defaultConfig);

const messaging = firebase.messaging();

function incrementUnreadMessageCount() {
  self.registration.sync.register('incrementUnreadCount').then(() => {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'INCREMENT_UNREAD_COUNT'
        });
      });
    });
  });
}

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;

  const notificationOptions = {
    body: payload.notification.body,
    icon: "./favicon/favicon-48x48.png",
  };

  incrementUnreadMessageCount();

  self.registration.showNotification(notificationTitle, notificationOptions);
});