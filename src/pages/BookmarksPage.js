import { useSelector } from "react-redux";
import { InfiniteScrollObserver, PostCard } from "../components"

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
    <>
      <span className="text-2xl mb-4 font-semibold">
        Bookmarks ({currentUser.bookmarks.length})
      </span>
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
    </>
  );
};

