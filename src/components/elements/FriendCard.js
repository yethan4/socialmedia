import React, { useState } from 'react'

export const FriendCard = ({friendId}) => {
  const [friendStatus, setFriendStatus] = useState("friends");
  const [dropRemove, setDropRemove] = useState(false);

  return (
    <div className="w-48 px-1 py-1 shadow mt-2 rounded flex flex-col items-center">
      <img src="dog1.jpg" alt="" className="w-40 h-40 rounded object-cover"/>
      {friendStatus === "friends" && (
        <div className="flex flex-col items-center relative mt-3">
          <span className="font-semibold text-gray-900 dark:text-slate-50">Nickname</span>
          <div className="mt-1 w-full select-none">
            <button onClick={() => setDropRemove(!dropRemove)} className="pl-4 pr-2 py-1 bg-gray-700 text-slate-50 hover:bg-gray-600 dark:bg-gray-800 dark:text-slate-200 dark:hover:bg-gray-700">
              <i className="bi bi-person-check-fill mr-1"></i>
              Friends<i className="bi bi-three-dots ml-2"></i>
            </button>
            {dropRemove && (<button className="absolute top-16 left-0 w-44 text-sm shadow bg-white py-2 select-none text-gray-900 dark:bg-gray-700 dark:text-slate-50 dark:hover:bg-gray-600">Remove from friends</button>)}
          </div>
        </div>
      )}
      {friendStatus === "strangers" && (
        <div className="flex flex-col items-center relative mt-3">
          <span className="font-semibold text-gray-900 dark:text-slate-50">Nickname</span>
          <button className="px-4 mt-1 py-1 bg-blue-700 text-slate-50 text-sm hover:bg-blue-600">Add Friend</button>
        </div>
      )}
      {friendStatus === "pendingSent" && (
        <div className="flex flex-col items-center relative mt-3">
          <span className="font-semibold text-gray-900 dark:text-slate-50">Nickname</span>
          <button className="px-4 mt-1 py-1 bg-gray-600 text-slate-50 text-sm hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600">Remove request</button>
        </div>
      )}
      {friendStatus === "pendingReceived" && (
        <div className="flex flex-col items-center relative mt-3">
          <span className="font-semibold text-gray-900 dark:text-slate-50">Nickname</span>
          <div className="flex gap-2">
            <button className="px-2 mt-1 py-1 bg-green-600 text-white text-sm hover:bg-green-700">Accept</button>
            <button className="px-2 mt-1 py-1 bg-gray-600 text-slate-50 text-sm hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600">Reject</button>
          </div>
          
        </div>
      )}
    </div>
  )
}
