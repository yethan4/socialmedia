import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, deleteDoc, query, where, orderBy, limit, startAfter, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { getDocuments } from "./generalService";

export const updateCommentsCount = async (postId, i) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    commentsCount: increment(i),
  });
};

export const addComment = async (authorId, postId, content) => {
  const commentRef = await addDoc(collection(db, "comments"), {
    authorId,
    postId,
    content,
    createdAt: serverTimestamp(),
  });

  await updateCommentsCount(postId, 1);

  return commentRef
};

export const deleteComment = async(commentId, postId) => {
  await deleteDoc(doc(db, "comments", commentId));

  await updateCommentsCount(postId, -1);
};

export const getComments = async (userId, fromDoc = null) => {
  const constraints = [
    where("authorId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(8),
  ];

  if (fromDoc) {
    constraints.push(startAfter(fromDoc));
  }

  const q = query(collection(db, "comments"), ...constraints);

  const { docs: comments, lastDoc: lastVisible } = await getDocuments(q);

  return { comments, lastVisible };
};


export const subscribeToComments = (postId, callback) => {
  const q = query(
    collection(db, "comments"),
    where("postId", "==", postId),
    orderBy("createdAt", "asc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(fetchedComments);
  });

  return unsubscribe;
};


