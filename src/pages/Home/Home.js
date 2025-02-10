import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "../../firebase/config";

import { FriendsSidebar } from "./components";
import { CreatePost, PostCard, Sidebar } from "../../components";

import { addPosts, setLoading, setPosts } from "../../actions/postsAction";

import loadingGif from "../../assets/loading.gif"
import { useTitle } from "../../hooks/useTitle";

import { HomeSkeleton } from "../../components/skeletons"


export const Home = () => {
  useTitle()
  const [noMorePosts, setNoMorePosts] = useState(false);
  const [activeTab, setActiveTab] = useState("explore");

  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.authState.userInfo)
  const posts = useSelector(state => state.postsState.posts);
  const lastVisible = useSelector(state => state.postsState.lastVisible);
  const loading = useSelector(state => state.postsState.loading);

  const observerRef = useRef(null);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setNoMorePosts(false);
  }

  useEffect(() => {
    const fetchPosts = async() => {
      dispatch(setLoading(true));
      try {
        const postsRef = collection(db, "posts");
        let q = "";
        if (activeTab === "friends") {
          q = query(
            postsRef, 
            orderBy("createdAt", "desc"),
            where("authorId", "in", currentUser.friends),
            limit(4)
          );
        } else if (activeTab === "explore") {
          q = query(
            postsRef, 
            orderBy("createdAt", "desc"),
            where("visibility", "==", "public"),
            limit(4)
          );
        }
        
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
  }, [dispatch, activeTab])

  const loadMorePosts = async () => {
    if (!lastVisible) {
      setNoMorePosts(true);
      return;
    }
  
    dispatch(setLoading(true));
  
    try {
      const postsRef = collection(db, "posts");
      let q 
      if(activeTab === "friends"){
        q = query(postsRef, 
          orderBy("createdAt", "desc"), 
          startAfter(lastVisible),
          where("authorId", "in", currentUser.friends), 
          limit(7));
      }else if(activeTab === "explore"){
        q = query(postsRef, 
          orderBy("createdAt", "desc"), 
          startAfter(lastVisible),
          where("visibility", "==", "public"),
          limit(7));
      }
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  
        dispatch(addPosts(posts, newLastVisible));
      } else {
        setNoMorePosts(true);
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

  if (loading && posts.length === 0) {
    return <HomeSkeleton />;
  }

  return (
    <div className="flex h-full w-full pt-20 dark:bg-gray-900">
      <Sidebar />
      <div className="bg-gray-0 h-full flex-1 w-full max-w-[1000px] sm:min-w-[480px]">
        <div className="container max-w-full sm:max-w-[700px] m-auto flex flex-col">
          <CreatePost />
          
          <div className="w-full flex bg-white text-lg shadow mx-auto rounded-xl dark:bg-gray-800 max-lg:max-w-[480px]">
            <div
              className={`flex-1 py-4 flex justify-center cursor-pointer dark:text-gray-50 rounded-l-xl transition-all ${
                activeTab === "friends" ? "bg-gray-100 dark:bg-gray-700 font-semibold" : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => changeTab("friends")}
            >
              <i className="bi bi-house mr-2"></i>
              <span>Home</span>
            </div>
            <div
              className={`flex-1 py-4 flex justify-center cursor-pointer dark:text-gray-50 rounded-r-xl transition-all ${
                activeTab === "explore" ? "bg-gray-100 dark:bg-gray-700 font-semibold" : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => changeTab("explore")}
            >
              <i className="bi bi-compass mr-2"></i>
              <span>Explore</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-6 mb-8">
            { posts.map((post) => {
              return <PostCard post={post} key={post.id} />
            })}
          </div>
          {/* Element obserwowany na dole */}
          {!noMorePosts && (
            <div ref={observerRef} className="h-20 flex justify-center mb-10">
              <img src={loadingGif} alt="loading gif" className="h-8" />
            </div>
          )}
        </div>
      </div>
      <FriendsSidebar />
    </div>
  );
};
