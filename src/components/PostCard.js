import { useEffect, useState } from "react";

import { CommentCard, CreateComment } from "./";
import { fetchUser } from "../services/fetchUser";
import { formatTimestamp } from "../utils/timeUtils";


export const PostCard = ({post}) => {
  const [comments, setComments] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [author, setAuthor] = useState([]);

  useEffect(() => {
    fetchUser(post.authorId).then((user) => setAuthor(user));
  }, [post.authorId])

  const formattedTime = formatTimestamp(post.createdAt.seconds);

  return (
    <div className="shadow-lg flex flex-col w-full rounded-lg items-center dark:bg-gray-800 bg-white p-4 max-lg:max-w-[480px] max-lg:mx-auto">
      <div className="flex items-center w-full mb-4">
        <img src={author?.avatar} alt="Avatar" className="w-10 h-10 rounded-full mr-3 object-cover" />
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-200">{author?.username}</span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{formattedTime}</span>
        </div>
      </div>
      
      { post.img && <div className="w-full mb-4 flex justify-center"><img src={post.img} alt="postImage" className="max-w-full max-h-[500px] rounded-lg shadow-sm" /></div>}
      

      {post.content && <div className="text-sm w-full font-normal text-gray-700 dark:text-gray-300 mb-4 px-2">{post.content}</div>}

      <div className="flex items-center text-sm font-medium justify-start w-full text-gray-600 dark:text-gray-300 mb-2 px-2">
        <i className={isLiked ? "bi bi-heart-fill mr-1 text-red-600" : "bi bi-heart mr-1"}></i>
        <span className="hover:underline cursor-pointer select-none">{post.likesCount}</span>
        <i className="bi bi-chat ml-4 mr-1"></i>
        <span className="hover:underline cursor-pointer select-none" onClick={() => setShowComments((prev) => !prev)}>{post.commentsCount}</span>
      </div>

      <div className="flex w-full border-t mt-2 dark:border-gray-500">
        <div className="flex-1 flex items-center justify-center py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-red-500" onClick={() => setIsLiked((prev) => !prev)}>
          <i className={isLiked ? "bi bi-heart-fill text-xl mr-1 text-red-600" : "bi bi-heart text-xl mr-1"}></i>
          <p className="text-base">Like</p>
        </div>
        <div onClick={() => setShowComments((prev) => !prev)} className="flex-1 flex items-center justify-center py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
          <i className="bi bi-chat text-xl mr-1"></i>
          <p className="text-base">Comment</p>
        </div>
      </div>
      {showComments && comments && (
        <div className="max-h-[350px] border-t w-full flex flex-col overflow-y-auto dark-scrollbar always-scrollbar dark:border-gray-500">
          
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
        </div>
      )}
      {
        showComments && (
          <CreateComment />
        )
      }
      
    </div>
  )
}
