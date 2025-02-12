import React, { useState } from 'react'
import { formatTimeAgo } from '../../../utils/timeUtils';
import { Link } from 'react-router-dom';
import { AvatarImage } from '../../../components';

export const ChatInfo = ({chat, chatPartner}) => {
  const [option, setOption] = useState("");

  const createdTime = formatTimeAgo(chat?.createdAt?.seconds)
  
  const messagesWithImages = chat?.messages?.filter(msg => msg?.img)

  return (
    <div className="max-lg:w-64 lg:w-96 border-l-2 dark:border-gray-700">
      
      <Link to={`/profile/${chatPartner?.id}`}>
      <div className="flex flex-col items-center justify-center mt-4">
        <AvatarImage src={chatPartner?.avatar} size={24}/>
        <span className="mt-2 text-xl font-semibold">{chatPartner?.username}</span>
      </div>
      </Link>
      
      <div className="flex flex-col mt-10 px-1">

        <div className="flex flex-col items-center">
          <div className="cursor-pointer select-none px-4 py-2 rounded-lg w-full text-center hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => {option == "info" ? setOption("") : setOption("info")}}>
            <i class="bi bi-info-circle mr-1"></i>
            <span className="text-lg">Info</span>
            <i className={option === "info" ? "bi bi-chevron-up ml-2" : "bi bi-chevron-down ml-2"}></i>
          </div>

          {option === "info" && 
          <div className="flex flex-col gap-1 mt-2">
            <span>Chat created - {createdTime}</span>
            <span>Message counter - {chat.messages?.length}</span>
          </div>
          }
        </div>

        <div className="flex flex-col items-center">
          <div className="cursor-pointer select-none px-4 py-2 rounded-lg w-full text-center hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => {option == "photos" ? setOption("") : setOption("photos")}}>
            <i className="bi bi-images mr-1"></i>
            <span className="text-lg">Photos</span>
            <i className={option === "photos" ? "bi bi-chevron-up ml-2" : "bi bi-chevron-down ml-2"}></i>
          </div>

          {option === "photos" && messagesWithImages?.length > 0 &&
            <div className="flex flex-wrap mt-2 gap-2">
              {messagesWithImages.map((msg, index) => (
                <div key={index} className="w-28 h-28 overflow-hidden rounded-lg">
                  <img 
                    src={msg.img} 
                    alt={`photo-${index}`} 
                    className="object-cover w-full h-full" 
                  />
                </div>
              ))}
            </div>
          }
          {option === "photos" && messagesWithImages?.length === 0 && (
            <span>No photos in this chat</span>
          )}
        </div>
        
        <div className="px-16 mt-4">
          <div className="cursor-pointer select-none py-2 rounded-lg w-full text-center bg-red-500 text-slate-50 hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-700">
            <i class="bi bi-ban mr-1"></i>
            <span className="text-lg">Block user</span>
          </div>
        </div>
      </div>

    </div>
  )
}
