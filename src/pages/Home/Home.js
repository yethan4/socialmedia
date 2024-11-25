import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";

import { FriendsSidebar, Sidebar } from "./components";
import { CreatePost, PostCard } from "../../components";

import { setLoading, setPosts } from "../../actions/postsAction";


export const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.postsState.posts)

  useEffect(() => {
    const fetchPosts = async() => {
      dispatch(setLoading(true));
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"), limit(10));
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
        </div>
      </div>
      <FriendsSidebar />
    </div>
  );
};
