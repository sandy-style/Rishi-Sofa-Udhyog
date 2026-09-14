import axios from "axios";
import { backendUrl } from "../App";

const subscribeToPushNotifications = async (token) => {
  try {
    console.log("Starting customer push notification setup...");

    if (!token) {
      console.log("No token found. Push subscription skipped.");
      return;
    }

    if (!("Notification" in window)) {
      console.log("Browser notifications are not supported.");
      return;
    }

    if (!("serviceWorker" in navigator)) {
      console.log("Service workers are not supported.");
      return;
    }

    if (!("PushManager" in window)) {
      console.log("Push notifications are not supported.");
      return;
    }

    let permission = Notification.permission;

    if (permission === "default") {
      console.log("Requesting notification permission...");
      permission = await Notification.requestPermission();
    }

    console.log("Customer notification permission:", permission);

    if (permission !== "granted") {
      console.log("Notification permission was not granted.");
      return;
    }

    console.log("Waiting for service worker...");

    const registration = await navigator.serviceWorker.ready;

    console.log("Customer service worker is ready.");

    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log("Existing customer push subscription found.");

      await saveSubscription(subscription, token);

      return;
    }

    const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

    if (!publicKey) {
      console.log("VITE_VAPID_PUBLIC_KEY is missing.");
      return;
    }

    console.log("Creating new customer push subscription...");

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    console.log("Customer push subscription created.");

    await saveSubscription(subscription, token);

    console.log("Customer push notification subscription successful.");
  } catch (error) {
    console.log(
      "CUSTOMER PUSH SUBSCRIPTION ERROR:",
      error.response?.data || error.message,
    );
  }
};

const saveSubscription = async (subscription, token) => {
  try {
    console.log("Saving customer push subscription to backend...");

    const subscriptionJson = subscription.toJSON();

    if (
      !subscriptionJson.endpoint ||
      !subscriptionJson.keys?.p256dh ||
      !subscriptionJson.keys?.auth
    ) {
      console.log("Invalid push subscription data.");
      return;
    }

    const response = await axios.post(
      backendUrl + "/api/push/subscribe",
      {
        endpoint: subscriptionJson.endpoint,
        keys: {
          p256dh: subscriptionJson.keys.p256dh,
          auth: subscriptionJson.keys.auth,
        },
        isAdmin: false,
      },
      {
        headers: {
          token,
        },
      },
    );

    console.log("Customer push subscription backend response:", response.data);

    if (!response.data.success) {
      console.log(
        "Failed to save customer push subscription:",
        response.data.message,
      );
    }
  } catch (error) {
    console.log(
      "SAVE CUSTOMER PUSH SUBSCRIPTION ERROR:",
      error.response?.data || error.message,
    );
  }
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export default subscribeToPushNotifications;
