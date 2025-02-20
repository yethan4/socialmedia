import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserPresence } from "../../../hooks/useUserPresence";
import { AvatarImage } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserIfNeeded } from "../../../actions/usersAction";

export const FriendSidebarCard = ({ userId }) => {
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.usersState.users[userId])
  
  const { isOnline, lastActive } = useUserPresence(userId);

  useEffect(() => {
    dispatch(fetchUserIfNeeded(userId));
  }, [userId, dispatch]);

  return (
    <Link to={`/profile/${userId}`}>
    <div className="relative flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
      <div className="relative">
        <AvatarImage src={userData?.avatar} size={10} />
       {isOnline ? (
        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-300 bg-green-500 dark:border-gray-500"></div>
       ) : (
        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-300 bg-gray-700 dark:border-gray-500"></div>
       )}
      </div>
      <div className="flex flex-col justify-center ">
        <span>{userData?.username}</span>
        {!isOnline && lastActive && (<span className="text-[9px] text-gray-700 font-semibold dark:text-slate-400">{lastActive}</span>)}
      </div>
    </div>
    </Link>
  )
}
