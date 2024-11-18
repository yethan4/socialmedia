import { useState } from "react";

import { CommentCard, CreateComment } from "./";


export const PostCard = () => {
  const [comments, setComments] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="shadow-lg flex flex-col rounded-lg items-center dark:bg-gray-800 bg-white p-4 max-lg:max-w-[480px] max-lg:mx-auto">
      <div className="flex items-center w-full mb-4">
        <img src="dog1.jpg" alt="Avatar" className="w-10 h-10 rounded-full mr-3 object-cover" />
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-200">Super dog</span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">15 minutes ago</span>
        </div>
      </div>
      
      <div className="w-full mb-4 flex justify-center">
        <img src="dog2.jpg" alt="Dog" className="max-w-full max-h-[500px] rounded-lg shadow-sm" />
      </div>

      <div className="text-sm font-normal text-gray-700 dark:text-gray-300 mb-4 px-2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores maxime, atque dolor, minus enim voluptatem perspiciatis ducimus dolorem tenetur placeat cupiditate earum ipsam deserunt similique. Dolor omnis rem voluptates hic.
      </div>

      <div className="flex items-center text-sm font-medium justify-start w-full text-gray-600 dark:text-gray-300 mb-2 px-2">
      <i className={isLiked ? "bi bi-heart-fill mr-1 text-red-600" : "bi bi-heart mr-1"}></i>
        <span className="hover:underline cursor-pointer select-none">432</span>
        <i className="bi bi-chat ml-6 mr-1"></i>
        <span className="hover:underline cursor-pointer select-none" onClick={() => setShowComments((prev) => !prev)}>22</span>
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
