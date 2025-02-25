import { useEffect, useState } from "react";
import { subscribeToComments } from "../services/commentsService";

export const useComments = (postId, showComments) => {
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    if (!showComments) return;

    const unsubscribe = subscribeToComments(postId, (fetchedComments) => {
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
