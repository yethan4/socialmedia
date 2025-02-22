import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const addPost = async(content, authorId, img, visibility) => {
  const docRef = await addDoc(collection(db, "posts"), {
    content,
    authorId,
    createdAt: serverTimestamp(),
    img, //url
    likesCount: 0,
    commentsCount: 0,
    visibility,
  });

  const docSnapshot = await getDoc(docRef);
  return { id: docRef.id, ...docSnapshot.data() };
}

export const toggleBookmark = async(shouldBookmark, userId, postId) => {
  const docRef = doc(db, "users", userId);

  await updateDoc(docRef, {
    bookmarks: shouldBookmark ? arrayUnion(postId) : arrayRemove(postId),
  });
}

export const changeVisibility = async(newStatus, postId) => {
  const docRef = doc(db, "posts", postId);
      
  await updateDoc(docRef, {
    visibility: newStatus
  });
}