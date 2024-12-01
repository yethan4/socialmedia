import { useEffect, useState } from "react"
import { fetchUser } from "../../services/fetchUser"
import { formatTimestamp } from "../../utils/timeUtils";
import { useSelector } from "react-redux";
import { deleteDoc, doc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Link } from "react-router-dom";

export const CommentCard = ({comment}) => {
  const [author, setAuthor] = useState(null);
  const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);
  const [showOptions, setShowOption] = useState(false);

  const userInfo = useSelector(state => state.authState.userInfo);

  const formattedTime = formatTimestamp(comment.createdAt?.seconds);

  useEffect(() => {
    if(userInfo.id === comment.authorId){
      setIsCurrentUserAuthor(true);
    }
  }, [userInfo])

  useEffect(() => {
    fetchUser(comment.authorId).then((user) => {
      setAuthor(user)
    })
  }, [comment.authorId])

  const handleDeleteComment = async() => {
    try{
      const document = doc(db, "comments", comment.id)
      await deleteDoc(document)

      const postRef = doc(db, "posts", comment.postId);
      await updateDoc(postRef, {
        commentsCount: increment(-1)
      });
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="mt-1 mb-3 flex items-start dark:text-gray-200">
  <Link to={`/profile/${author?.id}`}>
    <img
      src={author?.avatar}
      alt=""
      className="w-8 h-8 object-cover rounded-full mt-2 cursor-pointer shadow-md"
    />
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
      {isCurrentUserAuthor && (
        <span
          onClick={() => setShowOption(!showOptions)}
          className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <i className="bi bi-three-dots"></i>
        </span>
      )}
    </div>
    <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
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
