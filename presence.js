
import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";

import { rtdb } from "./firebase.js";

let connectionListener = null;

export function startPresence(uid) {
  if (!uid) return;

  const connectedRef = ref(rtdb, ".info/connected");
  const statusRef = ref(rtdb, "status/" + uid);

  if (connectionListener) {
    connectionListener();
  }

  connectionListener = onValue(connectedRef, async (snapshot) => {
    if (snapshot.val() !== true) return;

    try {
      await onDisconnect(statusRef).set({
        state: "offline",
        lastChanged: serverTimestamp()
      });

      await set(statusRef, {
        state: "online",
        lastChanged: serverTimestamp()
      });
    } catch (error) {
      console.error("Presence Error:", error);
    }
  });
}
export async function stopPresence(uid) {
  if (!uid) return;

  const statusRef = ref(rtdb, "status/" + uid);

  try {
    await set(statusRef, {
      state: "offline",
      lastChanged: serverTimestamp()
    });
  } catch (error) {
    console.error("Offline Status Error:", error);
  }
}
