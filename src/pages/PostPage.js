import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostCard } from "../components";
import { fetchDocument } from "../services/generalService";

export const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null); 
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const result = await fetchDocument(id, "posts")

        if (result) {
          setPost({ id, ...result });
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
