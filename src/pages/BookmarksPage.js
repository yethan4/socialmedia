import { useDispatch, useSelector } from "react-redux";
import { PostCard, Sidebar } from "../components"
import { useEffect, useRef, useState } from "react";
import { collection, documentId, getDocs, limit, query, startAfter, where } from "firebase/firestore";
import { addPosts, setLoading, setPosts } from "../actions/postsAction";
import { db } from "../firebase/config";

import loadingGif from "../assets/loading.gif";

export const BookmarksPage = () => {
  const [noMorePosts, setNoMorePosts] = useState(false);
  
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.authState.userInfo)
  const posts = useSelector(state => state.postsState.posts);
  const lastVisible = useSelector(state => state.postsState.lastVisible);
  const loading = useSelector(state => state.postsState.loading);

  const observerRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(setLoading(true));
      try {
        const postsRef = collection(db, "posts");
  
        const q = query(postsRef, 
          where(documentId(), "in", userInfo.bookmarks),
          limit(5)
        );
  
        const querySnapshot = await getDocs(q);
  
        let posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        posts = posts.sort((a, b) => 
          userInfo.bookmarks.indexOf(b.id) - userInfo.bookmarks.indexOf(a.id)
        );
  
        dispatch(setPosts(posts, lastVisible));
        return posts;
  
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setLoading(false));
      }
    };
  
    if (userInfo?.bookmarks?.length) {
      fetchPosts();
    } else {
      dispatch(setPosts([], []));
      setNoMorePosts(true);
    }
  }, [dispatch, userInfo]);

  const loadMorePosts = async () => {
    if (!lastVisible) {
      setNoMorePosts(true);
      return;
    }

    dispatch(setLoading(true));

    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, 
        where(documentId(), "in", userInfo.bookmarks),
        startAfter(lastVisible),
        limit(5)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        let posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        posts = posts.sort((a, b) => 
          userInfo.bookmarks.indexOf(b.id) - userInfo.bookmarks.indexOf(a.id)
        );

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
        if (entries[0].isIntersecting && lastVisible && !loading && userInfo) {
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
            <span className="text-2xl mb-4 font-semibold">Bookmarks({userInfo.bookmarks.length})</span>
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
