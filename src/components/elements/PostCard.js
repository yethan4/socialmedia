import { useCallback, useEffect, useRef, useState } from "react";

import { AvatarImage, CommentCard, ConfirmBox, CreateComment, ImageViewer, UserCard } from "..";
import { deleteDocument, fetchDocument } from "../../services/generalService";
import { formatTimeAgo } from "../../utils/timeUtils";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deletePost } from "../../actions/postsAction";
import { Link } from "react-router-dom";
import { deleteImage } from "../../services/imageService";
import { toggleBookmark, changeVisibility } from "../../services/postsService";
import { useComments } from "../../hooks/useComments";
import { useLikes } from "../../hooks/useLikes";

export const PostCard = ({post}) => {
  const [showComments, setShowComments] = useState(false);
  const [scrollCommentToggle, setScrollCommentToggle] = useState(false);
  const [author, setAuthor] = useState([]);
  const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isVisibilityChanging, setIsVisibilityChanging] = useState(false);
  const [visibilityStatus, setVisibilityStatus] = useState(post.visibility);

  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.authState.userInfo)

  const { 
    likeId, 
    likesList, 
    showLikes, 
    setShowLikes, 
    handleLike, 
    handleDislike, 
    handleLikesDisplay 
  } = useLikes(post.id, currentUser.id, author.id);

  const { 
    comments, 
    commentsCount,
    setCommentsCount,
   } = useComments(post.id, showComments, post.authorId);

  const commentsContainerRef = useRef(null);

  useEffect(() => {
    setCommentsCount(post.commentsCount);
  }, [post.commentsCount, setCommentsCount]);

  useEffect(() => {
    if(currentUser?.bookmarks.includes(post.id)){
      setIsBookmarked(true);
    }
  }, [post.id, currentUser.bookmarks])

  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [scrollCommentToggle, showComments]);

  useEffect(() => {
    if(currentUser.id === post.authorId){
      setIsCurrentUserAuthor(true);
    }
  }, [currentUser.id, post.authorId])

  useEffect(() => {
    fetchDocument(post.authorId, "users").then((user) => setAuthor(user));
  }, [post.authorId])

  const formattedTime = formatTimeAgo(post.createdAt.seconds);

  const handleDelete = useCallback(async() => {
    try{
      await deleteDocument("posts", post.id);

      if(post.img){
        await deleteImage(post.img)
      }

      dispatch(deletePost(post.id))
      toast.success("The post has been deleted.");
      setShowDeleteConfirmation(false);
    }catch(err){
      console.log(err)
    }finally{
      setShowDeleteConfirmation(false);
    }
  }, [post.id, post.img, dispatch]);

  const handleBookmark = useCallback(async (shouldBookmark) => {
    setIsBookmarked(shouldBookmark)
    try{
      await toggleBookmark(shouldBookmark, currentUser.id, post.id)
    }catch(err){
      console.log(err)
    }
  }, [currentUser.id, post.id]);

  const handleChangeVisibility = useCallback(async () => {
    try {
      const newStatus = visibilityStatus === "friends" ? "public" : "friends"
      await changeVisibility(newStatus, post.id)
      setVisibilityStatus(newStatus);
      setIsVisibilityChanging(false);
    } catch (error) {
      console.log("Błąd podczas aktualizacji:", error);
    }
  }, [post.id, visibilityStatus]);

  return (
    <div className="relative shadow-lg flex flex-col w-full rounded-lg items-center dark:bg-gray-800 bg-white p-4 max-lg:max-w-[480px] max-lg:mx-auto">
        <div className="flex items-center w-full mb-4">
          
        {/* Avatar */}
        <Link to={`/profile/${author?.id}`} className="mr-2">
          <AvatarImage src={author?.avatar} size={10} />
        </Link>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Link to={`/profile/${author?.id}`}><span className="hover:underline text-lg font-semibold text-gray-900 dark:text-gray-200 w-fit">{author?.username}</span></Link>
              <div className="relative">
              {isCurrentUserAuthor ? (
                <div 
                  onClick={() => setIsVisibilityChanging(!isVisibilityChanging)}
                  className="z-30 text-xs flex gap-1 bg-gray-200 px-1 rounded-xl dark:text-gray-100 dark:bg-gray-700 cursor-pointer select-none"
                >
                  <i className={visibilityStatus === "friends" ? "bi bi-people" : "bi bi-globe"}></i>
                  <span>{visibilityStatus}</span>
                  <span className="text-xs"><i className={isVisibilityChanging ? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"}></i></span>
                </div>
              ) : (
                <div  
                  className="z-30 text-xs flex gap-1 bg-gray-200 px-1 rounded-xl dark:text-gray-100 dark:bg-gray-700 cursor-default select-none"
                >
                  <i className={post?.visibility === "friends" ? "bi bi-people" : "bi bi-globe"}></i>
                  <span>{post?.visibility}</span>
                </div>
              )}
              {isCurrentUserAuthor && isVisibilityChanging && (
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
          <span className="text-xl dark:text-gray-300" onClick={() => handleBookmark(true)}>
            <i className="bi bi-bookmark cursor-pointer"></i>
          </span>
        )}

        { !isCurrentUserAuthor && isBookmarked && (
          <span className="text-xl dark:text-gray-300" onClick={() => handleBookmark(false)}>
            <i className="bi bi-bookmark-fill cursor-pointer"></i>
          </span>
        )}

        { isCurrentUserAuthor && (
           <span className="cursor-pointer text-lg rounded-full px-1 hover:text-red-500 dark:text-gray-300" onClick={() => setShowDeleteConfirmation(true)}>
            <i className="bi bi-trash3"></i>
          </span>
        )}
      </div>
      
      {/* PostImg*/}
      {post.img && (
        <ImageViewer
          src={post.img}
          alt="postImage"
          className={"max-w-full max-h-[500px] rounded-lg shadow-sm mb-2"}
        />
      )}


      {post.content && <div className="text-sm w-full font-normal text-gray-700 dark:text-gray-300 mb-4 px-1 whitespace-pre-wrap">{post.content}</div>}

      <div className="flex items-center text-sm font-medium justify-start w-full text-gray-600 dark:text-gray-300 mb-2 px-1">
        <i className={likeId ? "bi bi-heart-fill mr-1 text-red-600" : "bi bi-heart mr-1"}></i>
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
        {likeId ? (
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
        <ConfirmBox 
          question="Are you sure you want to delete this post?" 
          answers={["Delete", "Cancel"]}
          handleYes={handleDelete}
          handleNo={() => setShowDeleteConfirmation(false)}
        />
      )}
      
    </div>
  )
}