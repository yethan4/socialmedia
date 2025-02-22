import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export const addNotification = async (fromUserId, toUserId, type, postId=null) => {
  const notificationData = {
    fromUserId,
    toUserId,
    timestamp: serverTimestamp(),
    seen: false,
    type,
  };

  if (postId) {
    notificationData.postId = postId;
  }

  return await addDoc(collection(db, "notifications"), notificationData);
};

export const markNotificationAsSeen = async (id) => {
  const notificationRef = doc(db, "notifications", id);
  await updateDoc(notificationRef, { seen: true });
}