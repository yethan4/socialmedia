import { useEffect, useRef, useState } from "react";
import { CommentCard } from "../../../components";
import { useSelector } from "react-redux";
import { collection, query, where, orderBy, limit, startAfter, onSnapshot } from "firebase/firestore";
import loadingGif from "../../../assets/loading.gif";
import { db } from "../../../firebase/config";
import { Link } from "react-router-dom";

export const MyComments = () => {
  const [noMoreComments, setNoMoreComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef(null);

  const userInfo = useSelector(state => state.authState.userInfo);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsQuery = query(
          collection(db, "comments"),
          where("authorId", "==", userInfo.id),
          orderBy("createdAt", "desc"),
          limit(8)
        );

        const unsubscribe = onSnapshot(commentsQuery, (querySnapshot) => {
          const commentsResult = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          if (!querySnapshot.empty) {
            const lastVisibleComment = querySnapshot.docs[querySnapshot.docs.length - 1];
            setComments(commentsResult);
            setLastVisible(lastVisibleComment);
          } else {
            setNoMoreComments(true);
          }
        });

        return unsubscribe; // Return the unsubscribe function
      } catch (err) {
        console.error(err);
      }
    };

    if (userInfo) {
      fetchComments();
    }
  }, [userInfo]);

  const loadMoreComments = async () => {
    if (!lastVisible) {
      setNoMoreComments(true);
      return;
    }

    setLoading(true);

    try {
      const commentsQuery = query(
        collection(db, "comments"),
        where("authorId", "==", userInfo.id),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(7)
      );

      const unsubscribe = onSnapshot(commentsQuery, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const commentsResult = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const lastVisibleComment = querySnapshot.docs[querySnapshot.docs.length - 1];

          setComments((prevComments) => [...prevComments, ...commentsResult]);
          setLastVisible(lastVisibleComment);
        } else {
          setNoMoreComments(true);
        }
      });

      return unsubscribe; // Return the unsubscribe function
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && lastVisible && !loading) {
          loadMoreComments();
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
    <div className="bg-gray-0 h-full flex-1 mx-auto max-w-[1024px] px-4 pb-4 flex flex-col gap-4">
      {comments && comments.map((comment) => (
        <div className="shadow px-4 pt-2 rounded-xl dark:shadow-gray-400 dark:shadow-sm" key={comment.id}>
          <CommentCard comment={comment} />
          <Link to={`/post/${comment.postId}`}>
            <div className="text-sm py-2 px-2 w-fit my-2 cursor-pointer dark:text-slate-50 underline">
              Show Post
            </div>
          </Link>
        </div>
      ))}

      {!noMoreComments && (
        <div ref={observerRef} className="h-20 flex justify-center mb-10">
          <img src={loadingGif} alt="loading gif" className="h-8" />
        </div>
      )}
    </div>
  );
};
