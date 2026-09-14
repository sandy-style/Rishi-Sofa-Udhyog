self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || "RSU Furniture";

  const options = {
    body: data.message || "You have a new notification.",
    icon: "/logo.png",
    badge: "/logo.png",
    data: {
      type: data.type || null,
      orderId: data.orderId || null,
      productId: data.productId || null,
      url: "/orders",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};

  // Always take the customer to the Orders page
  const url = "/orders";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if ("navigate" in client) {
            return client.navigate(url).then(() => client.focus());
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});
