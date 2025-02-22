import { addDoc, collection, deleteDoc, doc, getDocs, increment, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/config";

export const giveLike = async (userId, postId, authorId) => {
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

    if(userId!==authorId){
      await addDoc(collection(db, "notifications"), {
        fromUserId: userId,
        toUserId: authorId,
        postId: postId,
        timestamp: serverTimestamp(),
        seen: false,
        type: "like",
      })
    }

    return likeRef.id
  }catch(err){
    console.log(err)
  }
};

export const removeLike = async(likeId, postId) => {
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
};

export const getLike = async(postId, userId) => {
  const q = query(
    collection(db, "likes"), 
    where("postId", "==", postId),
    where("userId", "==", userId),
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0]?.id
};

export const getLikes = async(postId) => {
  const q = query(
    collection(db, "likes"),
    where("postId", "==", postId),
    orderBy("timestamp", "desc")
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const likesResponse = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return likesResponse
  }

  return null;
}