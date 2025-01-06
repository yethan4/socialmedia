import { addDoc, collection, deleteDoc, doc, increment, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const firebaseLike = async (userId, postId, authorId) => {
  try{
    const postRef = doc(db, "posts", postId);

    await updateDoc(postRef, {
      likesCount: increment(1)
    });

    const likeRef = await addDoc(collection(db, "likes"), {
      userId: userId,
      postId: postId,
      timestamp: serverTimestamp()
    });

    const notificationRef = await addDoc(collection(db, "notifications"), {
      fromUserId: userId,
      toUserId: authorId,
      postId: postId,
      timestamp: serverTimestamp(),
      seen: false,
      type: "like",
    })

    return likeRef.id
  }catch(err){
    console.log(err)
  }
}

export const firebaseDislike = async(likeId, postId) => {
  try{ 
    const document = doc(db, "likes", likeId)
    await deleteDoc(document);

    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likesCount: increment(-1)
    });
  }catch(err){
    console.log(err)
  }
}