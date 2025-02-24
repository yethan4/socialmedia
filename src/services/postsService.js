import { addDoc, arrayRemove, arrayUnion, collection, doc, documentId, getDoc, getDocs, limit, orderBy, query, serverTimestamp, startAfter, updateDoc, where } from "firebase/firestore";
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

export const getPosts = async(qFor, userId=null, friends=null, bookmarks=null) => {
  const postsRef = collection(db, "posts");
  let q = "";
  if (qFor === "friends") {
    q = query(
      postsRef, 
      orderBy("createdAt", "desc"),
      where("authorId", "in", friends),
      limit(5)
    );
  } else if (qFor === "explore") {
    q = query(
      postsRef, 
      orderBy("createdAt", "desc"),
      where("visibility", "==", "public"),
      limit(5)
    );
  }else if(qFor === "userPosts"){
    q = query(postsRef,
      where("authorId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(5)
    );
  }else if(qFor==="bookmarks"){
    q = query(postsRef, 
      where(documentId(), "in", bookmarks),
      limit(5)
    );
  }
  
  const querySnapshot = await getDocs(q);

  const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  return {posts, lastVisible}
}

export const getMorePosts = async(qFor, lastVisible, userId=null, friends=null, bookmarks=null) => {
  const postsRef = collection(db, "posts");
    let q 
    if(qFor === "friends"){
      q = query(postsRef, 
        orderBy("createdAt", "desc"), 
        startAfter(lastVisible),
        where("authorId", "in", friends), 
        limit(5));
    }else if(qFor === "explore"){
      q = query(postsRef, 
        orderBy("createdAt", "desc"), 
        startAfter(lastVisible),
        where("visibility", "==", "public"),
        limit(5));
    }else if(qFor === "userPosts"){
      q = query(postsRef,
        where("authorId", "==", userId),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(5)
      );
    }else if(qFor === "bookmarks"){
      q = query(postsRef, 
        where(documentId(), "in", bookmarks),
        startAfter(lastVisible),
        limit(5)
      );
    }

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      return {posts, newLastVisible}
    } else {
      return null
    }
};