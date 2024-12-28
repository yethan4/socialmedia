export const FriendRequestNotificationCard = () => {
  return (
    <div className="relative flex items-center cursor-pointer mx-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
      <img src="./dog2.jpg" alt="" className="w-12 h-12 rounded-full"/>
      <div className="flex flex-col ml-2">
      <div className="flex flex-col">
        <div>
          <span className="font-semibold mr-1 hover:underline">Nick</span>
          <span className="font-normal text-[10px]">5 minutes ago</span>
        </div>
        <span>sends a friend request!</span>
      </div>
      <div className="flex gap-2">
        <button className="px-2 py-1 cursor-pointe hover:bg-gray-200 dark:hover:bg-gray-600">
          <i className="bi bi-person-fill-add mr-1"></i>Accept
        </button>
        <button className="px-2 py-1 cursor-pointe hover:bg-gray-200 dark:hover:bg-gray-600">
          <i className="bi bi-person-dash-fill mr-1"></i>Reject
        </button>
      </div>
      </div>
      <div className="absolute top-0 bottom-0 right-1 flex items-center">
        <span className="rounded-full p-2 hover:bg-gray-200 hover:dark:bg-gray-600">x</span>
      </div>
    </div>
  )
}
