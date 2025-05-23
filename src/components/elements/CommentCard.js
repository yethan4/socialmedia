import { useCallback, useEffect, useState } from "react"
import { fetchDocument } from "../../services/generalService"
import { formatTimeAgo } from "../../utils/timeUtils";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AvatarImage } from "./AvatarImage";
import { deleteComment } from "../../services/commentsService";

export const CommentCard = ({comment, postAuthorId}) => {
  const [author, setAuthor] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const currentUser = useSelector(state => state.authState.userInfo);

  const formattedTime = formatTimeAgo(comment.createdAt?.seconds);

  useEffect(() => {
    if(currentUser.id === comment.authorId || postAuthorId === currentUser.id){
      setCanEdit(true);
    }
  }, [currentUser.id, comment.authorId, postAuthorId])

  useEffect(() => {
    fetchDocument(comment.authorId, "users").then((user) => {
      setAuthor(user)
    })
  }, [comment.authorId])

  const handleDeleteComment = useCallback(async() => {
    try{
      await deleteComment(comment.id, comment.postId)
      setShowOptions(false);
    }catch(err){
      console.log(err)
    }
  }, [comment.id, comment.postId])

  return (
    <div className="mt-1 mb-3 flex items-start dark:text-gray-200">
  <Link to={`/profile/${author?.id}`} className="mt-2">
    <AvatarImage src={author?.avatar} size={8} />
  </Link>
  <div className="relative flex flex-col ml-3 py-2 px-4 rounded-2xl bg-gray-100 dark:bg-gray-700 shadow-md w-full">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Link
          to={`/profile/${author?.id}`}
          className="font-semibold text-sm hover:underline cursor-pointer text-gray-700 dark:text-gray-100"
        >
          {author?.username}
        </Link>
        <span className="text-[10px] ml-2 mt-0.5 font-medium text-gray-500 dark:text-gray-400">
          {formattedTime}
        </span>
      </div>
      {canEdit && (
        <span
          onClick={() => setShowOptions(!showOptions)}
          className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <i className="bi bi-three-dots"></i>
        </span>
      )}
    </div>
    <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
      {comment?.content}
    </p>

    {showOptions && (
      <div
        className="absolute z-50 sm:top-8 max-sm:top-10 right-2 rounded-lg bg-white dark:bg-gray-600 shadow-lg w-28 h-fit animate-fade-in"
      >
        <button
          onClick={() => handleDeleteComment()}
          className="text-center py-2 px-4 w-full text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-500 dark:hover:text-white transition-all rounded-lg"
        >
          Delete
        </button>
      </div>
    )}
  </div>
</div>
  )
}
