import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { collection, query, where, orderBy, limit, startAfter, onSnapshot, getDocs } from "firebase/firestore";
import loadingGif from "../../../assets/loading.gif";
import { db } from "../../../firebase/config";
import { UserLikeCard } from "./UserLikedCard";

export const MyLikes = () => {
  const [noMoreLikes, setNoMoreLikes] = useState(false);
  const [likes, setLikes] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef(null);

  const userInfo = useSelector(state => state.authState.userInfo);

  useEffect(() => {
    const fetchLikes = async () => {
          try {
              const likesQuery = query(
                  collection(db, "likes"),
                  where("userId", "==", userInfo.id),
                  orderBy("timestamp", "desc"),
                  limit(8)
              );

              const querySnapshot = await getDocs(likesQuery);

              if (!querySnapshot.empty) {
                  const likesResult = querySnapshot.docs.map((doc) => ({
                      id: doc.id,
                      ...doc.data(),
                  }));

                  const lastVisibleLike = querySnapshot.docs[querySnapshot.docs.length - 1];

                  setLikes(likesResult);
                  setLastVisible(lastVisibleLike);
              } else {
                  setNoMoreLikes(true);
              }
          } catch (err) {
              console.error(err);
          }
      };

      if (userInfo) {
          fetchLikes();
      }
  }, [userInfo]);

  const loadMoreLikes = async () => {
      if (!lastVisible) {
          setNoMoreLikes(true);
          return;
      }

      setLoading(true);

      try {
          const likesQuery = query(
              collection(db, "likes"),
              where("userId", "==", userInfo.id),
              orderBy("timestamp", "desc"),
              startAfter(lastVisible),
              limit(7)
          );

          const querySnapshot = await getDocs(likesQuery);

          if (!querySnapshot.empty) {
              const likesResult = querySnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
              }));

              const lastVisibleLike = querySnapshot.docs[querySnapshot.docs.length - 1];

              setLikes((prevLikes) => [...prevLikes, ...likesResult]);
              setLastVisible(lastVisibleLike);
          } else {
              setNoMoreLikes(true);
          }
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
          loadMoreLikes();
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
    <div className="bg-gray-0 h-full flex-1 w-full pt-4 py-10 max-w-[1024px] mx-auto flex flex-col gap-4">

      {likes && likes.map((like) => (
        <UserLikeCard key={like.id} like={like} />
      ))}
      
      {noMoreLikes && (
        <div ref={observerRef} className="h-20 flex justify-center mb-10">
          <img src={loadingGif} alt="loading gif" className="h-8" />
        </div>
      )}
    </div>
  )
}
