import { useState } from "react"
import { FriendSidebarCard } from "./"

export const FriendsSidebar = () => {
  const [friends, setFriends] = useState(Array.from({ length: 16}, (_, index) => index));
  return (
    <div className="font-medium max-md:hidden sticky top-20 right-0 flex-1 h-[90vh] max-w-[350px] px-4 border-l overflow-y-scroll dark-scrollbar scrollbar-hidden hover:scrollbar-thin hover-scrollbar dark:border-gray-700 rounded-lg dark:text-slate-200">
      <div className="ml-4 mb-2 text-lg">Friends</div>
      {friends.map((index) => (
        <FriendSidebarCard key={index}/>
      ))}
    </div>
  )
}
