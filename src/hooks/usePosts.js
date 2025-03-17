import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPosts, setPosts } from "../actions/postsAction";
import { getPosts } from "../services/postsService";
import { setLoading } from "../actions/chatsAction";

export const usePosts = (category, {userId=null, friendStatus=null}) => {
  const currentUser = useSelector(state => state.authState.userInfo)
  const lastVisible = useSelector(state => state.postsState.lastVisible);

  const [noMorePosts, setNoMorePosts] = useState(false);
  const [postsLoaded, setPostLoaded] = useState(false);

  const dispatch = useDispatch();

  const filterPosts = useCallback((posts, friendStatus, userId) => {
    
    return posts.filter(post => {
      return post.visibility !== "friends" || friendStatus === "friends" || userId === currentUser.id;
    });
  }, [currentUser.id]);
  
  const sortPosts = useCallback((posts) => {
  
    return posts.sort((a, b) => 
      currentUser.bookmarks.indexOf(b.id) - currentUser.bookmarks.indexOf(a.id)
    );
  }, [currentUser.bookmarks]);
  
  const filterBlockedUsersPosts = useCallback((posts) => {
    const blockedIds = [
      ...new Set([
        ...(currentUser.blockedUsers || []), 
        ...(currentUser.blockedBy || [])
      ])
    ];    
  
    return posts.filter(post => !blockedIds.includes(post.authorId));
  }, [currentUser.blockedUsers, currentUser.blockedBy]);

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(setLoading(true));
      try {
        let postsData = { posts: [], lastVisible: null };

        if (category === "userPosts") {
          postsData = await getPosts("userPosts", {userId}) || { posts: [], lastVisible: null };
          postsData.posts = postsData.posts.length>0 ? filterPosts(postsData.posts) : [];
        } else if (category === "bookmarks") {
          if (!currentUser?.bookmarks?.length) {
            setNoMorePosts(true);
            return;
          }
          postsData = await getPosts("bookmarks", {bookmarks: currentUser.bookmarks});
          postsData.posts = sortPosts(postsData.posts);
        } else {
          if (category === "friends" && currentUser.friends.length === 0) {
            setNoMorePosts(true);
            return;
          }
          postsData = await getPosts(category, {friends: currentUser.friends});
        }

        const { posts, newLastVisible } = postsData;

        if (posts.length === 0) {
          setNoMorePosts(true);
          return;
        }

        const filteredPosts = filterBlockedUsersPosts(posts)
  
        dispatch(setPosts(filteredPosts, newLastVisible));
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading(false));
        setPostLoaded(true);
      }
    };

    dispatch(setPosts([], []));
    fetchPosts();
    }, [dispatch, category, userId, currentUser.id, currentUser.bookmarks, currentUser.friends, filterBlockedUsersPosts, filterPosts, sortPosts, friendStatus]);
  

  const loadMorePosts = async () => {
      if (!lastVisible) {
        setNoMorePosts(true);
        return;
      }
  
      dispatch(setLoading(true));
  
      try {
        let postsData = { posts: [], newLastVisible: null };
        
        if(category==="userPosts"){
          const result = await getPosts("userPosts", {fromDoc: lastVisible, userId});

          if(!result){
            setNoMorePosts(true);
            return;
          }

          postsData.posts = filterPosts(result.posts);
          postsData.newLastVisible = result.newLastVisible;
        }else if(category === "bookmarks"){
          const result = await getPosts("bookmarks", {fromDoc: lastVisible, bookmarks: currentUser.bookmarks});

          if(!result){
            setNoMorePosts(true);
            return;
          }

          postsData.posts = sortPosts(result.posts);
          postsData.newLastVisible = result.newLastVisible;
        }else{
          const result  = await getPosts(category, {fromDoc: lastVisible, friends:currentUser.friends})

          if(!result){
            setNoMorePosts(true);
            return;
          }
          postsData = result
        }

        if(!postsData.posts.empty){
          const { posts, newLastVisible } = postsData;
          const filteredPosts = filterBlockedUsersPosts(posts)
          dispatch(addPosts(filteredPosts, newLastVisible));
        }else{
          setNoMorePosts(true)
        }
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    
  
  return {
    noMorePosts,
    setNoMorePosts,
    postsLoaded,
    setPostLoaded,
    loadMorePosts
  }
}
