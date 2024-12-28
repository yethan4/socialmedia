import React from 'react'

export const NotificationCard = () => {
  
  return (
    <div className="flex items-center cursor-pointer px-2 py-1 hover:bg-gray-100">
      <img src="./dog2.jpg" alt="" className="w-12 h-12 rounded-full"/>
      <div className="flex ml-2">
        <span className="font-semibold mr-1">Nickname</span>
        <span>just liked your post!</span>
        <i class="ml-1 bi bi-balloon-heart"></i>
      </div>
    </div>
  )
}
