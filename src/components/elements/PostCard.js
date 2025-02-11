import { useCallback, useEffect, useRef, useState } from "react";

import { CommentCard, CreateComment, ImageViewer, UserCard } from "..";
import { fetchDocument } from "../../services/oneDocumentService";
import { formatTimeAgo } from "../../utils/timeUtils";
import { useDispatch, useSelector } from "react-redux";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { toast } from "react-toastify";
import { deletePost, dislikePost, likePost } from "../../actions/postsAction";
import { deleteObject, ref } from "firebase/storage";
import { Link } from "react-router-dom";
import { firebaseDislike, firebaseLike} from "../../services/likeService";


export const PostCard = ({post}) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [scrollCommentToggle, setScrollCommentToggle] = useState(false);
  const [liked, setLiked] = useState(null);
  const [showLikes, setShowLikes] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const [author, setAuthor] = useState([]);
  const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [changeVisibility, setChangeVisibility] = useState(false);
  const [visibilityStatus, setVisibilityStatus] = useState(post.visibility);

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
    if (showComments) {
      try {
        const q = query(
          collection(db, "comments"),
          where("postId", "==", post.id),
          orderBy("createdAt", "asc")
        );
  
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setComments(fetchedComments);
          setCommentsCount(fetchedComments.length);
        });
  
        return () => unsubscribe();
      } catch (err) {
        console.log(err);
      }
    }
  }, [showComments, post]);

  useEffect(() => {
    if(userInfo.id === post.authorId){
      setIsCurrentUserAuthor(true);
    }
  }, [userInfo, post])

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

  useEffect(() => {
    if(userInfo){
      if (userInfo.bookmarks.includes(post.id)) setIsBookmarked(true);
    }
  }, [userInfo, post])


  const formattedTime = formatTimeAgo(post.createdAt.seconds);

  const handleDelete = useCallback(async() => {
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
  }, [post.id, post.img, dispatch]);

  const handleLike = useCallback(async() => {
    try{
      const likeResponse =await firebaseLike(userInfo.id, post.id, author.id);
      dispatch(likePost(post.id));
      setLiked(likeResponse)
    }catch(err){
      console.log(err)
    }
  }, [userInfo.id, post.id, author.id])

  const handleDislike = useCallback(async() => {
    try{
      await firebaseDislike(liked, post.id);
      dispatch(dislikePost(post.id));
      setLiked(null);

    }catch(err){
      console.log(err)
    }
  }, [post.id, dispatch])

  const handleLikesDisplay = useCallback(async () => {
    setShowLikes(true);
    try{
      const q = query(
        collection(db, "likes"),
        where("postId", "==", post.id),
        orderBy("timestamp", "desc"),
     );
     const querySnapshot = await getDocs(q);

     if(!querySnapshot.empty){
      const likesResponse = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data() }));
      setLikesList(likesResponse);
     }

    }catch(err){
      console.log(err)
    }
  }, [post.id, dispatch]);

  const handleBookmark = useCallback(async () => {
    setIsBookmarked(true)
    try{
      const docRef = doc(db, "users", userInfo.id);

      await updateDoc(docRef, {
        bookmarks: arrayUnion(post.id)
      });
    }catch(err){
      console.log(err)
    }
  }, [userInfo.id, post.id]);

  const handleUnBookmark = useCallback(async () => {
    setIsBookmarked(false)
    try{
      const docRef = doc(db, "users", userInfo.id);

      await updateDoc(docRef, {
        bookmarks: arrayRemove(post.id)
      });
    }catch(err){
      console.log(err)
    }
  }, [userInfo.id, post.id]);

  const handleChangeVisibility = useCallback(async () => {
    try {
      const docRef = doc(db, "posts", post.id); // Poprawione wywołanie doc()
      
      const newStatus = visibilityStatus == "friends" ? "public" : "friends"
      await updateDoc(docRef, {
        visibility: newStatus
      });
  
      setVisibilityStatus(newStatus);
      setChangeVisibility(false);
    } catch (error) {
      console.log("Błąd podczas aktualizacji:", error);
    }
  }, [userInfo.id, post.id, visibilityStatus]);

  return (
    <div className="relative shadow-lg flex flex-col w-full rounded-lg items-center dark:bg-gray-800 bg-white p-4 max-lg:max-w-[480px] max-lg:mx-auto">
        <div className="flex items-center w-full mb-4">
          
        <Link to={`/profile/${author?.id}`}><img src={author?.avatar} alt="Avatar" className="w-10 h-10 rounded-full mr-3 object-cover" /></Link>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Link to={`/profile/${author?.id}`}><span className="hover:underline text-lg font-semibold text-gray-900 dark:text-gray-200 w-fit">{author?.username}</span></Link>
              <div className="relative">
              {isCurrentUserAuthor ? (
                <div 
                  onClick={() => setChangeVisibility(!changeVisibility)}
                  className="z-30 text-xs flex gap-1 bg-gray-200 px-1 rounded-xl dark:text-gray-100 dark:bg-gray-700 cursor-pointer select-none"
                >
                  <i className={visibilityStatus === "friends" ? "bi bi-people" : "bi bi-globe"}></i>
                  <span>{visibilityStatus}</span>
                  <span className="text-xs"><i className={changeVisibility ? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"}></i></span>
                </div>
              ) : (
                <div  
                  className="z-30 text-xs flex gap-1 bg-gray-200 px-1 rounded-xl dark:text-gray-100 dark:bg-gray-700 cursor-default select-none"
                >
                  <i className={post?.visibility === "friends" ? "bi bi-people" : "bi bi-globe"}></i>
                  <span>{post?.visibility}</span>
                </div>
              )}
              {isCurrentUserAuthor && changeVisibility && (
                <div className="z-30 absolute flex justify-center w-36 px-1 py-2 top-6 bg-gray-100 text-sm rounded-xl dark:text-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                  <span className="w-fit" onClick={handleChangeVisibility}>
                    Change to {visibilityStatus === "friends" ? "public" : "friends"}
                  </span>
                </div>
              )}

              </div>
            </div>
            
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{formattedTime}</span>
          </div>
        </div>  

      <div className="absolute top-3 right-2">
        { !isCurrentUserAuthor && !isBookmarked && (
          <span className="text-xl dark:text-gray-300" onClick={handleBookmark}>
            <i className="bi bi-bookmark cursor-pointer"></i>
          </span>
        )}

        { !isCurrentUserAuthor && isBookmarked && (
          <span className="text-xl dark:text-gray-300" onClick={handleUnBookmark}>
            <i className="bi bi-bookmark-fill cursor-pointer"></i>
          </span>
        )}

        { isCurrentUserAuthor && (
           <span className="cursor-pointer text-lg rounded-full px-1 hover:text-red-500 dark:text-gray-300" onClick={() => setShowDeleteConfirmation(true)}>
            <i className="bi bi-trash3"></i>
          </span>
          // <span className="cursor-pointer text-lg rounded-full px-1 hover:text-red-500 dark:text-gray-300" onClick={() => setShowDeleteConfirmation(true)}>
          //   <i className="bi bi-trash3"></i>
          // </span>
          
        )}
      </div>
      
      { post.img && (
        <div className="w-full mb-4 flex justify-center">
          <ImageViewer src={post.img} alt="postImage" className="max-w-full max-h-[500px] rounded-lg shadow-sm" />
        </div>)}

      {post.content && <div className="text-sm w-full font-normal text-gray-700 dark:text-gray-300 mb-4 px-1">{post.content}</div>}

      <div className="flex items-center text-sm font-medium justify-start w-full text-gray-600 dark:text-gray-300 mb-2 px-1">
        <i className={liked ? "bi bi-heart-fill mr-1 text-red-600" : "bi bi-heart mr-1"}></i>
        <span 
          className={post?.likesCount ? "hover:underline cursor-pointer select-none" : "select-none"}
          onClick={() => {
            if (post?.likesCount!==0) {
              handleLikesDisplay();
            }
          }}
        >{post.likesCount}</span>
        <i className="bi bi-chat ml-4 mr-1"></i>
        <span className="hover:underline cursor-pointer select-none" onClick={() => setShowComments((prev) => !prev)}>{commentsCount}</span>
        {/*list who liked */}
        {showLikes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="z-40 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-auto w-[400px] h-[500px] flex flex-col gap-1 pt-8 pb-2 px-2 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-y-auto dark-scrollbar always-scrollbar">
              <span className="absolute top-2 right-2 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700" onClick={() => setShowLikes(false)}>
                <i className="bi bi-x-lg"></i>
              </span>
              <span className="text-center text-lg font-medium select-none">Likes({post.likesCount})</span>
              {likesList && likesList.map((like) => (
                <UserCard key={like.userId} userId={like.userId}/>
              ))}
            </div>
            
          </div>
        )}
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
          <CommentCard key={comment.id} comment={comment} postAuthorId={author?.id} />
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
