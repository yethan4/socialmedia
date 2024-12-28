import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { db } from "../../firebase/config";

import { FriendsSidebar } from "./components";
import { CreatePost, PostCard, Sidebar } from "../../components";

import { addPosts, setLoading, setPosts } from "../../actions/postsAction";

import loadingGif from "../../assets/loading.gif"
import { useTitle } from "../../hooks/useTitle";


export const Home = () => {
  useTitle()
  const dispatch = useDispatch();
  const posts = useSelector(state => state.postsState.posts);
  const lastVisible = useSelector(state => state.postsState.lastVisible);
  const loading = useSelector(state => state.postsState.loading); 

  const observerRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async() => {
      dispatch(setLoading(true));
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
    
        const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        
        dispatch(setPosts(posts, lastVisible));
        return posts; 
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchPosts();
  }, [dispatch])

  const loadMorePosts = async () => {
    if (!lastVisible) {
      console.warn("Brak kolejnych postów do załadowania.");
      return;
    }
  
    dispatch(setLoading(true));
  
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, orderBy("createdAt", "desc"), startAfter(lastVisible), limit(7));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  
        dispatch(addPosts(posts, newLastVisible));
      } else {
        console.log("Brak więcej postów do załadowania.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && lastVisible && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );
  
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
  
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [lastVisible, loading]);

  return (
    <div className="flex h-full w-full pt-20 dark:bg-gray-900">
      <Sidebar />
      <div className="bg-gray-0 h-full flex-1 w-full max-w-[1000px] sm:min-w-[480px]">
        <div className="container max-w-full sm:max-w-[700px] m-auto flex flex-col">
          <CreatePost />
          <div className="mt-8 flex flex-col gap-6 mb-8">
            { posts.map((post) => {
              return <PostCard post={post} key={post.id} />
            })}
          </div>
          {/* Element obserwowany na dole */}
          <div ref={observerRef} className="h-20 flex justify-center mb-10">
            <img src={loadingGif} alt="loading gif" className="h-8" />
          </div>
        </div>
      </div>
      <FriendsSidebar />
    </div>
  );
};
