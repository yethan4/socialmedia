import { useState } from "react"
import { FriendSidebarCard } from "./"
import { useSelector } from "react-redux"
import { FriendsSidebarSkeleton } from "../../../components/skeletons"

export const FriendsSidebar = () => {
  const friends = useSelector(state => state.authState.userInfo?.friends)

  return (
    <div className="font-medium max-md:hidden sticky top-20 right-0 flex-1 h-[90vh] max-w-[350px] px-4 border-l overflow-y-auto dark-scrollbar scrollbar-hidden hover:scrollbar-thin hover-scrollbar dark:border-gray-700 rounded-lg dark:text-slate-200">
      <div className="ml-4 mb-2 text-lg">Friends</div>
      {friends && friends.map((friendId) => (
        <FriendSidebarCard key={friendId} userId={friendId}/>
      ))}
    </div>
  )
}
