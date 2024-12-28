import { useEffect, useRef, useState } from "react";

import { CommentCard, CreateComment } from "..";
import { fetchDocument } from "../../services/fetchDocument";
import { formatTimestamp } from "../../utils/timeUtils";
import { useDispatch, useSelector } from "react-redux";
import { addDoc, collection, deleteDoc, doc, getDocs, increment, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { toast } from "react-toastify";
import { deletePost, dislikePost, likePost } from "../../actions/postsAction";
import { deleteObject, ref } from "firebase/storage";
import { Link } from "react-router-dom";


export const PostCard = ({post}) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [scrollCommentToggle, setScrollCommentToggle] = useState(false);
  const [liked, setLiked] = useState(null);
  const [author, setAuthor] = useState([]);
  const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.authState.userInfo)

  const commentsContainerRef = useRef(null);

  useEffect(() => {
    setCommentsCount(post.commentsCount);
  }, [post]);

  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [scrollCommentToggle, showComments]);

  useEffect(() => {
    if(showComments){
      try{
        const q = query(
          collection(db, "comments"),
          where("postId", "==", post.id),
          orderBy("createdAt", "asc")
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setComments(fetchedComments)
          setCommentsCount(fetchedComments.length)
        })

      }catch(err){
        console.log(err)
      }
    }
  }, [showComments])

  useEffect(() => {
    if(userInfo.id === post.authorId){
      setIsCurrentUserAuthor(true);
    }
  }, [userInfo])

  useEffect(() => {
    fetchDocument(post.authorId, "users").then((user) => setAuthor(user));
  }, [post.authorId])

  useEffect(() => {
    const fetchLike = async() => {
      const q = query(
        collection(db, "likes"), 
        where("postId", "==", post.id),
        where("userId", "==", userInfo.id),
      );

      const querySnapshot = await getDocs(q);
      setLiked(querySnapshot.docs[0]?.id)
    };
    
    fetchLike();
  }, [post, userInfo])


  const formattedTime = formatTimestamp(post.createdAt.seconds);

  const handleDelete = async() => {
    try{
      await deleteDoc(doc(db, "posts", post.id));

      if(post.img){
        const desertRef = ref(storage, post.img);
        deleteObject(desertRef).then(() => {
          // File deleted successfully
        }).catch((error) => {
          console.log(error)
        });
      }

      dispatch(deletePost(post.id))
      toast.success("The post has been deleted.");
      setShowDeleteConfirmation(false);
    }catch(err){
      console.log(err)
    }
  };

  const handleLike = async() => {
    try{

      const postRef = doc(db, "posts", post.id);

      await updateDoc(postRef, {
        likesCount: increment(1)
      });

      const likeRef = await addDoc(collection(db, "likes"), {
        userId: userInfo.id,
        postId: post.id,
        timestamp: serverTimestamp()
      });

      const notificationRef = await addDoc(collection(db, "notifications"), {
        fromUserId: userInfo.id,
        toUserId: author.id,
        postId: post.id,
        timestamp: serverTimestamp(),
        seen: false,
        type: "like",
      })

      dispatch(likePost(post.id))
      setLiked(likeRef.id);
    }catch(err){
      console.log(err)
    }
  }

  const handleDislike = async() => {
    try{
      
      const document = doc(db, "likes", liked)
      await deleteDoc(document);

      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        likesCount: increment(-1)
      });
      dispatch(dislikePost(post.id))
      setLiked(null);

    }catch(err){
      console.log(err)
    }
  }


  return (
    <div className="relative shadow-lg flex flex-col w-full rounded-lg items-center dark:bg-gray-800 bg-white p-4 max-lg:max-w-[480px] max-lg:mx-auto">
        <div className="flex items-center w-full mb-4">
        <Link to={`/profile/${author?.id}`}><img src={author?.avatar} alt="Avatar" className="w-10 h-10 rounded-full mr-3 object-cover" /></Link>
          <div className="flex flex-col">
            <Link to={`/profile/${author?.id}`}><span className="hover:underline text-lg font-semibold text-gray-900 dark:text-gray-200 w-fit">{author?.username}</span></Link>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{formattedTime}</span>
          </div>
        </div>  

      <div className="absolute top-3 right-2">
        { !isCurrentUserAuthor && !isBookmarked && (
          <span className="text-xl dark:text-gray-300" onClick={() => setIsBookmarked(true)}>
            <i className="bi bi-bookmark cursor-pointer"></i>
          </span>
        )}

        { !isCurrentUserAuthor && isBookmarked && (
          <span className="text-xl dark:text-gray-300" onClick={() => setIsBookmarked(false)}>
            <i className="bi bi-bookmark-fill cursor-pointer"></i>
          </span>
        )}

        { isCurrentUserAuthor && (
          <span className="cursor-pointer text-lg rounded-full px-1 hover:text-red-500 dark:text-gray-300" onClick={() => setShowDeleteConfirmation(true)}>
            <i className="bi bi-trash3"></i>
          </span>
        )}
      </div>
      
      { post.img && (
        <div className="w-full mb-4 flex justify-center">
          <img src={post.img} alt="postImage" className="max-w-full max-h-[500px] rounded-lg shadow-sm" />
        </div>)}

      {post.content && <div className="text-sm w-full font-normal text-gray-700 dark:text-gray-300 mb-4 px-2">{post.content}</div>}

      <div className="flex items-center text-sm font-medium justify-start w-full text-gray-600 dark:text-gray-300 mb-2 px-2">
        <i className={liked ? "bi bi-heart-fill mr-1 text-red-600" : "bi bi-heart mr-1"}></i>
        <span className="hover:underline cursor-pointer select-none">{post.likesCount}</span>
        <i className="bi bi-chat ml-4 mr-1"></i>
        <span className="hover:underline cursor-pointer select-none" onClick={() => setShowComments((prev) => !prev)}>{commentsCount}</span>
      </div>

      <div className="flex w-full border-t mt-2 dark:border-gray-500">
        {liked ? (
        <div className="select-none flex-1 flex items-center justify-center py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-red-500" onClick={handleDislike}>
          <i className="bi bi-heart-fill text-xl mr-1 text-red-600"></i>
          <p className="text-base">Like</p>
        </div>
        ) : (
        <div className="select-none flex-1 flex items-center justify-center py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-red-500" onClick={handleLike}>
          <i className="bi bi-heart text-xl mr-1"></i>
          <p className="text-base">Like</p>
        </div>
        )}
        
        <div onClick={() => setShowComments((prev) => !prev)} className="select-none flex-1 flex items-center justify-center py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
          <i className="bi bi-chat text-xl mr-1"></i>
          <p className="text-base">Comment</p>
        </div>
      </div>
      {showComments && comments && 
      <div 
        ref={commentsContainerRef}
        className="max-h-[350px] p-0 border-t w-full flex flex-col overflow-y-auto dark-scrollbar always-scrollbar dark:border-gray-500"
      >
      {comments.map((comment) => {
        
        return (
          <CommentCard key={comment.id} comment={comment} />
        )
      })}
      </div>
      }
      {showComments && (<CreateComment postId={post?.id} postAuthorId={author?.id} setScrollCommentToggle={setScrollCommentToggle}/>)}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
              Are you sure you want to delete this post?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}
