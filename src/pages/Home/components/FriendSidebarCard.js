export const FriendSidebarCard = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
      <img src="avatar.jpg" alt="" className="object-cover w-10 h-10 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700" />
      <span>Johny Johny</span>
    </div>
  )
}
