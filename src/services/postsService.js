import { addDoc, arrayRemove, arrayUnion, collection, doc, documentId, getDoc, getDocs, limit, orderBy, query, serverTimestamp, startAfter, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { getDocuments } from "./generalService";

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

export const getPosts = async (qFor, { userId = null, friends = null, bookmarks = null, fromDoc = null }) => {
  const postsRef = collection(db, "posts");
  const constraints = [limit(5)];

  if (qFor === "friends") {
    constraints.push(orderBy("createdAt", "desc"), where("authorId", "in", friends));
  } else if (qFor === "explore") {
    constraints.push(orderBy("createdAt", "desc"), where("visibility", "==", "public"));
  } else if (qFor === "userPosts") {
    constraints.push(where("authorId", "==", userId), orderBy("createdAt", "desc"));
  } else if (qFor === "bookmarks") {
    constraints.push(where(documentId(), "in", bookmarks));
  }

  if (fromDoc) {
    constraints.push(startAfter(fromDoc));
  }

  const q = query(postsRef, ...constraints);
  const { docs: posts, lastDoc: newLastVisible } = await getDocuments(q);

  return posts.length > 0 ? { posts, newLastVisible } : null;
};