import { useSelector } from "react-redux"
import { FriendsList } from "../components"

export const FriendsPage = () => {
  const userInfo = useSelector(state => state.authState?.userInfo)

  return (
    <div className="flex-1 flex flex-col items-center mt-0 m-auto dark:text-slate-100">
      <h1 className="text-2xl font-semibold mb-4">Your Friends({userInfo?.friends.length})</h1>
      {userInfo?.friends && <FriendsList friends={userInfo.friends} />}
    </div>
  )
}
