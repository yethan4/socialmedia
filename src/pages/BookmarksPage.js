import { useSelector } from "react-redux";
import { InfiniteScrollObserver, PostCard, Sidebar } from "../components"
import { useEffect, useRef} from "react";

import loadingGif from "../assets/loading.gif";
import { usePosts } from "../hooks/usePosts";

export const BookmarksPage = () => {
  const currentUser = useSelector(state => state.authState.userInfo)
  const posts = useSelector(state => state.postsState.posts);
  const loading = useSelector(state => state.postsState.loading);

  const {
    noMorePosts,
    loadMorePosts
  } = usePosts("bookmarks", {})

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
            <InfiniteScrollObserver 
              loadMore={loadMorePosts} 
              loading={loading} 
              hasMore={!noMorePosts} 
            />
          </div>
    </div>
  )
}
