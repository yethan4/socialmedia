import { collection, addDoc, serverTimestamp, updateDoc, doc, where, orderBy, limit, startAfter, query } from "firebase/firestore";
import { db } from "../firebase/config";
import { getDocuments } from "./generalService";

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

export const getNotifications = async({id, fromDoc}) => {
  const constraints = [
    where("toUserId", "==", id),
    orderBy("timestamp", "desc"),
    limit(10),
  ];

  if (fromDoc) {
    constraints.push(startAfter(fromDoc));
  }

  const q = query(collection(db, "notifications"), ...constraints);

  const { docs: notifications, lastDoc: lastVisible } = await getDocuments(q);

  return { notifications, lastVisible };
}