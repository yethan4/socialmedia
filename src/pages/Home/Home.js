import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FriendsSidebar } from "./components";
import { CreatePost, PostCard, Sidebar } from "../../components";

import { setPosts } from "../../actions/postsAction";

import loadingGif from "../../assets/loading.gif"
import { useTitle } from "../../hooks/useTitle";

import { HomeSkeleton } from "../../components/skeletons"
import { usePosts } from "../../hooks/usePosts";


export const Home = () => {
  useTitle()
  const [activeTab, setActiveTab] = useState("friends");

  const dispatch = useDispatch();
  const posts = useSelector(state => state.postsState.posts);
  const lastVisible = useSelector(state => state.postsState.lastVisible);
  const loading = useSelector(state => state.postsState.loading);

  const observerRef = useRef(null);

  const {
    noMorePosts,
    setNoMorePosts,
    postsLoaded,
    loadMorePosts
  } = usePosts(activeTab)

  const changeTab = (tab) => {
    if(tab===activeTab) return;
    setActiveTab(tab);
    setNoMorePosts(false);
    dispatch(setPosts([], null));
  }

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

  if (loading && !postsLoaded) {
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
              className={`flex-1 py-4 flex justify-center cursor-pointer dark:text-gray-50 rounded-l-xl ${
                activeTab === "friends" ? "bg-gray-100 dark:bg-gray-700 font-semibold" : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => changeTab("friends")}
            >
              <i className="bi bi-house mr-2"></i>
              <span>Home</span>
            </div>
            <div
              className={`flex-1 py-4 flex justify-center cursor-pointer dark:text-gray-50 rounded-r-xl ${
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
            { posts.length === 0 && noMorePosts && (
              <span className="px-10 py-4 shadow text-xl rounded w-full text-center dark:shadow-gray-700 dark:text-slate-50">No posts to load.</span>
            )}
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
