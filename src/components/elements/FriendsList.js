import { FriendCard } from "./FriendCard"

export const FriendsList = ({friends}) => {
  return (
    <div className="flex gap-x-4 justify-center gap-y-4  sm:flex-wrap pb-16 ">
      {
        friends && 
        friends.map((friendId) =>( 
          <FriendCard key={friendId} friendId={friendId} />
        ))
      }
    </div>
  )
}
