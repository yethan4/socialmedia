import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { UserLikeCard } from "./UserLikedCard";
import { getLikes } from "../../../services/likeService";
import { InfiniteScrollObserver } from "../../../components";

export const MyLikes = () => {
  const [noMoreLikes, setNoMoreLikes] = useState(false);
  const [likes, setLikes] = useState([]);
  const [lastVisibleLike, setLastVisibleLike] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentUser = useSelector(state => state.authState.userInfo);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
          const {likes, lastVisible} = await getLikes("likes", {userId: currentUser.id})

          if(likes.length>0){
            setLikes(likes);
            setLastVisibleLike(lastVisible)
          }else{
            setNoMoreLikes(true);
          }

      } catch (err) {
          console.error(err);
      }
    };

    if (currentUser.id) {
      fetchLikes();
    }
  }, [currentUser.id]);

  const loadMoreLikes = async () => {
      if (!lastVisibleLike) {
          setNoMoreLikes(true);
          return;
      }

      setLoading(true);

      try {
        const {likes, lastVisible} = await getLikes("likes", {userId: currentUser.id, fromDoc: lastVisibleLike})


        if(likes.length>0){
          setLikes((prevLikes) => [...prevLikes, ...likes]);
          setLastVisibleLike(lastVisible);
        }else{
          setNoMoreLikes(true);
        };
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="bg-gray-0 h-full flex-1 w-full pt-4 py-10 max-w-[1024px] mx-auto flex flex-col gap-4">

      {likes && likes.map((like) => (
        <UserLikeCard key={like.id} like={like} />
      ))}
      
      {lastVisibleLike && <InfiniteScrollObserver 
        loadMore={loadMoreLikes} 
        loading={loading} 
        hasMore={!noMoreLikes} 
      />}
    </div>
  )
}
