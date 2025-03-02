import { useEffect, useState } from "react";
import { subscribeToComments } from "../services/commentsService";
import { useSelector } from "react-redux";

export const useComments = (postId, showComments, postAuthorId) => {
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);

  const currentUser = useSelector(state => state.authState.userInfo);

  const filterBlockedUsersComments = (comments) => {
    const blockedIds = [...new Set([...currentUser.blockedUsers, ...currentUser.blockedBy])]
    if(postAuthorId != currentUser.id) comments = comments.filter(comment => !blockedIds.includes(comment.authorId))

    return comments
  }

  useEffect(() => {
    if (!showComments) return;

    const unsubscribe = subscribeToComments(postId, (fetchedComments) => {
      const filteredComments = filterBlockedUsersComments(fetchedComments)
      setComments(filteredComments);
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
