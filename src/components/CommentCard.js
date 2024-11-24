export const CommentCard = () => {
  return (
    <div className="mt-3 flex h-fit dark:text-gray-200">
      <img src="dog1.jpg" alt="" className="w-8 h-8 min-w-8 object-cover rounded-full mt-2 cursor-pointer"/>
      <div className="flex flex-col h-fit ml-1 mt-1 py-1 pl-3 pr-6 rounded-2xl bg-gray-100 dark:bg-gray-700">
        <div className="flex items-center">
          <span className="font-bold text-sm hover:underline cursor-pointer">Osbourne Shaelyn</span>
          <span className="text-[8px] ml-1 mt-1 font-semibold dark:text-gray-400">5 minutes ago</span>
        </div>
        <span className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing.</span>
      </div>
    </div>
  )
}
