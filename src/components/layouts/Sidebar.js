import bell from "../../assets/bell.png";
import bookmark from "../../assets/bookmark.png";
import calendar from "../../assets/calendar.png";
import chat from "../../assets/chat.png";
import friends from "../../assets/friends.png";
import group from "../../assets/group.png";
import happy from "../../assets/happy.png";
import pen from "../../assets/pen.png";
import activity from "../../assets/activity.png";
import settings from "../../assets/settings.png";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


export const Sidebar = () => {
  const userInfo = useSelector(state => state.authState.userInfo);

  return (
    <div className="max-xl:hidden font-medium sticky top-20 flex-1 h-[90vh] max-w-[350px] ml-10 flex flex-col gap-2 border-r dark:border-gray-700 dark:text-slate-200 dark:bg-gray-900 rounded-lg">
      <Link to={`/profile/${userInfo?.id}`}>
        <div className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
          <img 
            src={userInfo?.avatar} 
            alt={`${userInfo?.username}'s avatar`} 
            className="object-cover w-12 h-12 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700" 
          />
          <span>{userInfo?.username}</span>
        </div>
      </Link>

      <div className="border-b dark:border-gray-700 mt-2 pb-3">
        <Link to="/friends">
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={friends} className="h-6 w-6 mr-2" alt="Friends icon" />
            <span>Friends</span>
          </div>
        </Link>
        <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded relative">
          <img src={group} className="h-6 w-6 mr-2" alt="Groups icon" />
          <span>Groups</span>
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
            Soon
          </span>
        </div>

        <Link to="/chats">
        <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
          <img src={chat} className="h-6 w-6 mr-2" alt="Chats icon" />
          <span>Chats</span>
        </div>
        </Link>
      </div>

      <div className="border-b dark:border-gray-700 mt-2 pb-3">
        <Link to="/bookmarks">
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={bookmark} className="h-6 w-6 mr-2" alt="Bookmarks icon" />
            <span>Bookmarks</span>
          </div>
        </Link>
        <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded relative">
          <img src={calendar} className="h-6 w-6 mr-2" alt="Groups icon" />
          <span>Events</span>
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
            Soon
          </span>
        </div>
        <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
          <img src={happy} className="h-6 w-6 mr-2" alt="Mems icon" />
          <span>Mems</span>
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
            Soon
          </span>
        </div>
      </div>

      <div className="">
        <Link to="/notifications">
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={bell} className="h-6 w-6 mr-2" alt="Notifications icon" />
            <span>Notifications</span>
          </div>
        </Link>
        <Link to="/settings">
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={settings} className="h-6 w-6 mr-2" alt="Settings icon" />
            <span>Settings</span>
          </div>
        </Link>
        <Link to={`/profile/${userInfo.id}`}>
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={pen} className="h-6 w-6 mr-2" alt="My Posts icon" />
            <span>My Posts</span>
          </div>
        </Link>
        <Link to="/my-activity">
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <img src={activity} className="h-6 w-6 mr-2" alt="My Activity icon" />
            <span>My Activity</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

