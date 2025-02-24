import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPosts, setPosts } from "../actions/postsAction";
import { getMorePosts, getPosts } from "../services/postsService";
import { setLoading } from "../actions/chatsAction";


export const usePosts = (category, userId=null, friendStatus=null) => {
  const currentUser = useSelector(state => state.authState.userInfo)
  const lastVisible = useSelector(state => state.postsState.lastVisible);

  const [noMorePosts, setNoMorePosts] = useState(false);
  const [postsLoaded, setPostLoaded] = useState(false);

  const dispatch = useDispatch();

  const filterPosts = (posts) => {
    posts = posts.filter(post => {
      return post.visibility !== "friends" || friendStatus === "friends" || userId === currentUser.id;
    });

    return posts
  }

  const sortPosts = (posts) => {
    posts = posts.sort((a, b) => 
      currentUser.bookmarks.indexOf(b.id) - currentUser.bookmarks.indexOf(a.id)
    );

    return posts
  }

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(setLoading(true));
      try {
        let postsData = { posts: [], lastVisible: null };

        if (category === "userPosts") {
          postsData = await getPosts("userPosts", userId);
          postsData.posts = filterPosts(postsData.posts);
        } else if (category === "bookmarks") {
          if (!currentUser?.bookmarks?.length) {
            setNoMorePosts(true);
            return;
          }
          postsData = await getPosts("bookmarks", null, null, currentUser.bookmarks);
          postsData.posts = sortPosts(postsData.posts);
        } else {
          if (category === "friends" && currentUser.friends.length === 0) {
            setNoMorePosts(true);
            return;
          }
          postsData = await getPosts(category, null, currentUser.friends);
        }
        const { posts, lastVisible } = postsData;
  
        if (posts.length === 0) {
          setNoMorePosts(true);
          return;
        }
  
        dispatch(setPosts(posts, lastVisible));
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading(false));
        setPostLoaded(true);
      }
    };

    dispatch(setPosts([], []));
    fetchPosts();
    }, [dispatch, category, userId, currentUser.id, friendStatus]);
  

  const loadMorePosts = async () => {
      if (!lastVisible) {
        setNoMorePosts(true);
        return;
      }
  
      dispatch(setLoading(true));
  
      try {
        let postsData = { posts: [], newLastVisible: null };
        
        if(category==="userPosts"){
          const result = await getMorePosts("userPosts", lastVisible, userId);

          if(!result){
            setNoMorePosts(true);
            return;
          }

          postsData.posts = filterPosts(result.posts);
          postsData.newLastVisible = result.newLastVisible;
        }else if(category === "bookmarks"){
          const result = await getMorePosts("bookmarks", lastVisible, null, null, currentUser.bookmarks);

          if(!result){
            setNoMorePosts(true);
            return;
          }

          postsData.posts = sortPosts(result.posts);
          postsData.newLastVisible = result.newLastVisible;
        }else{
          const result  = await getMorePosts(category, lastVisible, null, currentUser.friends)

          if(!result){
            setNoMorePosts(true);
            return;
          }
          postsData = result
        }

        if(!postsData.posts.empty){
          const { posts, newLastVisible } = postsData;
          dispatch(addPosts(posts, newLastVisible));
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
