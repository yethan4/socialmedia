import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { PostCard } from "../components";

export const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null); // Explicitly set `null` for better clarity.
  const [error, setError] = useState(null); // Add error state for handling fetch issues.

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id, ...docSnap.data() });
        } else {
          console.log("No such document");
          setError("No such document found.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to fetch post.");
      }
    };

    fetchPost();
  }, [id]);

  return (
    <div className="mt-20 max-w-[700px] m-auto">
      {error ? (
        <p className="text-red-500">We couldn't find this post</p>
      ) : post ? (
        <PostCard post={post} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
