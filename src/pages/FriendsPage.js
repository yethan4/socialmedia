import { useSelector } from "react-redux"
import { FriendCard, Sidebar } from "../components"

export const FriendsPage = () => {
  const userInfo = useSelector(state => state.authState.userInfo)

  return (
    <div className="flex pt-20">
      <Sidebar />

      <div className="flex-1 max-w-[1000px] mt-0 m-auto dark:text-slate-100 shadow">
        <h1>Your Friends({userInfo.friends.length})</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-4">
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
        </div>
      </div>
    </div>
  )
}
