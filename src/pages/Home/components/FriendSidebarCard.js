import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserPresence } from "../../../hooks/useUserPresence";
import { AvatarImage } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserIfNeeded } from "../../../actions/usersAction";
import { createNewChat } from "../../../services/chatService";

export const FriendSidebarCard = ({ userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.usersState.users[userId]);
  const currentUserId = useSelector(state => state.authState.userInfo.id);
  
  const { isOnline, lastActive } = useUserPresence(userId);

  const handleMessage = async () => {
    await createNewChat(currentUserId, userId);
    
    navigate(`/chats/${userId}`)
  }
  

  useEffect(() => {
    dispatch(fetchUserIfNeeded(userId));
  }, [userId, dispatch]);

  return (
      <div className="flex items-center justify-between pr-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded">
        <Link to={`/profile/${userId}`} className="flex-1">
        <div className="relative flex items-center gap-2 px-4 py-2 rounded">
          <div className="relative">
            <AvatarImage src={userData?.avatar} size={10} />
          {isOnline ? (
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-300 bg-green-500 dark:border-gray-500"></div>
          ) : (
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-300 bg-gray-700 dark:border-gray-500"></div>
          )}
          </div>
          <div className="flex flex-col justify-center ">
            {userData?.username ? (
              <span>{userData?.username}</span>
            ) : (
              <div className="w-20 h-4 mb-1 bg-gray-300 dark:bg-gray-600 animate-puls rounded-xl"></div>
            )} 
            {!isOnline ? (lastActive ? (
              <span className="text-[9px] text-gray-700 font-semibold dark:text-slate-400">{lastActive}</span>
            ) : (
              <div className="w-12 h-2 mt-1 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-xl"></div>
            )) : (
              <span className="text-xs text-green-500 font-semibold">Now</span>
            )}

          </div>
        </div>
        </Link>
        <div 
          className="px-2 shadow dark:bg-gray-600 text-gray-800 dark:text-white rounded-full hover:bg-slate-200 dark:hover:bg-gray-500"
          onClick={handleMessage}
        >
          <span>Chat</span>
          <i i className="ml-2 bi bi-chat-dots-fill"></i>
        </div>
      </div>
  )
}
