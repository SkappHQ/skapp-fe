import { getApp, getApps, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

import { firebaseConfig } from "~community/common/configs/firebase";
import { appModes } from "~community/common/constants/configs";

const app =
  process.env.NEXT_PUBLIC_MODE === appModes.ENTERPRISE
    ? getApps().length === 0
      ? initializeApp(firebaseConfig)
      : getApp()
    : undefined;

let database: Database | undefined;

if (typeof window !== "undefined") {
  database =
    process.env.NEXT_PUBLIC_MODE === appModes.ENTERPRISE
      ? getDatabase(app)
      : undefined;
}

export { database };

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
