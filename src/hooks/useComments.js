import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export const useComments = (postId, showComments) => {
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    if (!showComments) return;

    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(fetchedComments);
      setCommentsCount(fetchedComments.length);
    });

    return () => unsubscribe();
  }, [postId, showComments]);

  return { 
    comments, 
    commentsCount,
    setCommentsCount,
   };
};
