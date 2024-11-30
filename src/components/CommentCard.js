import { useEffect, useState } from "react"
import { fetchUser } from "../services/fetchUser"
import { formatTimestamp } from "../utils/timeUtils";
import { useSelector } from "react-redux";
import { deleteDoc, doc, increment, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const CommentCard = ({comment}) => {
  const [author, setAuthor] = useState(null);
  const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);

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
    <div className="mt-1 mb-3 flex h-fit dark:text-gray-200">
      <img src={author?.avatar} alt="" className="w-8 h-8 min-w-8 object-cover rounded-full mt-2 cursor-pointer"/>
      <div className="relative flex flex-col h-fit ml-1 mt-1 py-1 pl-3 pr-9 rounded-2xl bg-gray-100 dark:bg-gray-700">
        <div className="flex items-center">
          <span className="font-bold text-sm hover:underline cursor-pointer">{author?.username}</span>
          <span className="text-[8px] ml-1 mt-1 font-semibold dark:text-gray-400">{formattedTime}</span>
        </div>
        <span className="text-sm">{comment?.content}</span>
        
        {isCurrentUserAuthor && (
        <span
        onClick={handleDeleteComment}
        className="absolute top-1 right-1 cursor-pointer text-md rounded-full px-1 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-100 ease-in-out"
        >
          <i className="bi bi-x"></i>
        </span>)}
      </div>
    </div>
  )
}
