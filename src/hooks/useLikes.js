import { useEffect, useState, useCallback } from "react";
import { giveLike, removeLike, getLike, getLikes } from "../services/likeService";
import { useDispatch, useSelector } from "react-redux";
import { likePost, dislikePost } from "../actions/postsAction";

export const useLikes = (postId, userId, authorId) => {
  const [likeId, setLikeId] = useState(null);
  const [likesList, setLikesList] = useState([]);
  const [showLikes, setShowLikes] = useState(false);
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.authState.userInfo)

  useEffect(() => {
    const fetchLike = async () => {
      try {
        const like = await getLike(postId, userId);
        setLikeId(like);
      } catch (err) {
        console.error("Error fetching like:", err);
      }
    };

    fetchLike();
  }, [postId, userId]);

  const handleLike = useCallback(async () => {
    try {
      const likeResponse = await giveLike(userId, postId, authorId);
      dispatch(likePost(postId));
      setLikeId(likeResponse);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  }, [userId, postId, authorId, dispatch]);

  const handleDislike = useCallback(async () => {
    try {
      if (!likeId) return;
      await removeLike(likeId, postId);
      dispatch(dislikePost(postId));
      setLikeId(null);
    } catch (err) {
      console.error("Error disliking post:", err);
    }
  }, [postId, likeId, dispatch]);

  const filterBlockedUsersLikes = useCallback((likes, authorId) => {
    const blockedIds = [...new Set([...currentUser.blockedUsers, ...currentUser.blockedBy])];
  
    if (authorId !== currentUser.id) {
      return likes.filter(like => !blockedIds.includes(like.userId));
    }
  
    return likes;
  }, [currentUser.blockedUsers, currentUser.blockedBy, currentUser.id]);

  const handleLikesDisplay = useCallback(async () => {
      setShowLikes(true);
      try{
        const {likes} = await getLikes("users", {postId})
        const filteredLikes = filterBlockedUsersLikes(likes)
        setLikesList(filteredLikes)
  
      }catch(err){
        console.log(err)
      }
    }, [postId, filterBlockedUsersLikes]);

  return {
    likeId,
    likesList,
    showLikes,
    setShowLikes,
    handleLike,
    handleDislike,
    handleLikesDisplay,
  };
};
