import bell from "../../../assets/bell.png";
import bookmark from "../../../assets/bookmark.png";
import calendar from "../../../assets/calendar.png";
import chat from "../../../assets/chat.png";
import friends from "../../../assets/friends.png";
import group from "../../../assets/group.png";
import happy from "../../../assets/happy.png";
import pen from "../../../assets/pen.png";
import activity from "../../../assets/activity.png";
import settings from "../../../assets/settings.png";


export const Sidebar = () => {
  return (
      <div className="max-xl:hidden font-medium sticky top-24 flex-1 h-[85vh] max-w-[350px] ml-10 flex flex-col gap-2 border-r dark:border-gray-700 dark:text-slate-200 dark:bg-gray-900 rounded-lg">
        <div className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
          <img src="avatar.jpg" alt="" className="object-cover w-12 h-12 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700" />
          <span>Johny Johny</span>
        </div>

        <div className="border-b dark:border-gray-700 mt-2 pb-3">
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={friends} className="h-6 w-6 mr-2" />Friends
          </div>
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={group} className="h-6 w-6 mr-2" />Groups
          </div>
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={chat} className="h-6 w-6 mr-2" />Chats
          </div>
        </div>

        <div className="border-b dark:border-gray-700 mt-2 pb-3">
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={bookmark} className="h-6 w-6 mr-2" />Bookmarks
          </div>
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={calendar} className="h-6 w-6 mr-2" />Events
          </div>
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={happy} className="h-6 w-6 mr-2" />Mems
          </div>
        </div>

        <div className="">
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={bell} className="h-6 w-6 mr-2" />notifications
          </div>
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={settings} className="h-6 w-6 mr-2" />Settings
          </div>
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={pen} className="h-6 w-6 mr-2" />My Posts
          </div>
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={activity} className="h-6 w-6 mr-2" />My Activity
          </div>
        </div>
      </div>
  )
}
