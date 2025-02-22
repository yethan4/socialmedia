import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";

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
}


