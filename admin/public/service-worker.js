self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || "New Notification";

  const options = {
    body: data.message || "You have a new notification.",
    icon: "/logo.png",
    badge: "/logo.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
