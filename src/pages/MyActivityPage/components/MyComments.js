import { useEffect, useState } from "react";
import { CommentCard, InfiniteScrollObserver } from "../../../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getComments } from "../../../services/commentsService";

export const MyComments = () => {
  const [noMoreComments, setNoMoreComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [lastVisibleComment, setLastVisibleComment] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentUser = useSelector(state => state.authState.userInfo);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const {comments, lastVisible} = await getComments(currentUser.id)
        if(comments.length>0){
          setComments(comments)
          setLastVisibleComment(lastVisible);
        }else{
          setNoMoreComments(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (currentUser.id) {
      fetchComments();
    }
  }, [currentUser.id]);

  const loadMoreComments = async () => {
    if (!lastVisibleComment) {
      setNoMoreComments(true);
      return;
    }

    setLoading(true);

    try {
      const {comments, lastVisible} = await getComments(currentUser.id, lastVisibleComment)
        if(comments.length>0){
          setComments((prevComments) => [...prevComments, ...comments])
          setLastVisibleComment(lastVisible);
        }else{
          setNoMoreComments(true);
        }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-0 h-full flex-1 w-full px-4 pb-4 flex flex-col gap-4">
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

      {lastVisibleComment && <InfiniteScrollObserver 
        loadMore={loadMoreComments} 
        loading={loading} 
        hasMore={!noMoreComments} 
      />}
    </div>
  );
};
