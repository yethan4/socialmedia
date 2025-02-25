import { addDoc, collection, deleteDoc, doc, getDocs, increment, limit, orderBy, query, serverTimestamp, startAfter, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { getDocuments } from "./generalService";

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

export const getLikes = async(qFor, {postId=null, userId=null, fromDoc=null}) => {
  const constraints = [
    limit(8),
  ];

  if(qFor==="users"){
    constraints.push(where("postId", "==", postId), orderBy("timestamp", "desc"));
  }else if(qFor==="likes"){
    constraints.push(where("userId", "==", userId), orderBy("timestamp", "desc"));
  };

  if (fromDoc) {
    constraints.push(startAfter(fromDoc));
  }

  const q = query(collection(db, "likes"), ...constraints);

  const { docs: likes, lastDoc: lastVisible } = await getDocuments(q);

  return { likes, lastVisible };
}