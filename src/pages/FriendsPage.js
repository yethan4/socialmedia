import { useSelector } from "react-redux"
import { FriendCard } from "../components"

export const FriendsPage = () => {
  const userInfo = useSelector(state => state.authState.userInfo)

  return (
    <>
      <div className="flex-1 flex flex-col items-center mt-0 m-auto dark:text-slate-100">
        <h1 className="text-2xl font-semibold mb-4">Your Friends({userInfo.friends.length})</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-4">
          { userInfo && userInfo.friends.map((id) => (
            <FriendCard key={id} friendId={id} />
          ))}
        </div>
      </div>
    </>
  )
}
