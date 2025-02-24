import { useDispatch, useSelector } from "react-redux";
import { PostCard, Sidebar } from "../components"
import { useEffect, useRef} from "react";

import loadingGif from "../assets/loading.gif";
import { usePosts } from "../hooks/usePosts";

export const BookmarksPage = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.authState.userInfo)
  const posts = useSelector(state => state.postsState.posts);
  const lastVisible = useSelector(state => state.postsState.lastVisible);
  const loading = useSelector(state => state.postsState.loading);

  const observerRef = useRef(null);

  const sortPosts = (posts) => {
    posts = posts.sort((a, b) => 
      currentUser.bookmarks.indexOf(b.id) - currentUser.bookmarks.indexOf(a.id)
    );

    return posts
  }

  const {
    noMorePosts,
    loadMorePosts
  } = usePosts("bookmarks")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && lastVisible && !loading && currentUser) {
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
  }, [lastVisible, loading, loadMorePosts]);

  return (
    <div className="flex pt-20">
          <Sidebar />
          <div className="flex-1 flex flex-col items-center mt-0 m-auto dark:text-slate-100">
            <span className="text-2xl mb-4 font-semibold">Bookmarks({currentUser.bookmarks.length})</span>
            <div className="mt-0 flex flex-col gap-3 pb-10 w-full max-w-[800px]">
              {posts.map((post) => (
                <PostCard post={post} key={post.id} />
              ))}
            </div>
            {!noMorePosts && (
              <div ref={observerRef} className="h-20 flex justify-center mb-10">
                <img src={loadingGif} alt="loading gif" className="h-8" />
              </div>
            )}
          </div>
    </div>
  )
}
