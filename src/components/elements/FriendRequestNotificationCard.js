import { Link, useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../../utils/timeUtils";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFriend, rejectFriendRequest } from "../../services/friendsService";
import { AvatarImage } from "./AvatarImage";
import { fetchUserIfNeeded } from "../../actions/usersAction";

export const FriendRequestNotificationCard = ({notification, setDropNotifications, setDeletedId}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.authState.userInfo);
  const author = useSelector((state) => state.usersState.users[notification.fromUserId])

  const formattedTime = formatTimeAgo(notification.timestamp.seconds);

  useEffect(() => {
    dispatch(fetchUserIfNeeded(notification.fromUserId));
  }, [notification.fromUserId, dispatch]);

  const handleDivClick = useCallback(async(e) => {
    if (!e.target.closest("a")) {
      try{
        if(setDropNotifications){
          setDropNotifications(false)
        }
        navigate(`/profile/${notification.fromUserId}`);
      }catch(e){
        console.log(e)
      }
    }
  }, [notification]);

  const handleDelete = useCallback(async(e) => {
    e.stopPropagation();
    try{
      setDeletedId(notification.id);
      await rejectFriendRequest(currentUser.id, notification.fromUserId)
    }catch(err){
      console.log(err)
    }
  }, [currentUser.id, notification.fromUserId])

  const handleAccept = useCallback(async(e) => {
    e.stopPropagation();
    try{
      await addFriend(currentUser.id, notification.fromUserId)
    }catch(err){
      console.log(err)
    }
  }, [currentUser.id, notification.fromUserId])

  return (
    <div 
      className="relative flex items-center cursor-pointer mx-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={handleDivClick}
    >
      <Link to={`/profile/${author?.id}`}>
        <AvatarImage src={author?.avatar} size={12}/>
      </Link>
      <div className="flex flex-col ml-2">
      <div className="flex flex-col">
        <div>
          <Link to={`/profile/${author?.id}`}>
            <span className="font-semibold mr-1 hover:underline">{author?.username}</span>
          </Link>
          <span className={notification?.seen ? "font-normal text-[10px]" : "font-normal text-[10px] text-blue-600"}>{formattedTime}</span>
        </div>
        <span>sends a friend request!</span>
      </div>
      <div className="flex gap-2">
        <button className="px-2 py-1 cursor-pointe hover:bg-gray-200 dark:hover:bg-gray-600" onClick={(e) => {handleAccept(e)}}>
          <i className="bi bi-person-fill-add mr-1"></i>Accept
        </button>
        <button className="px-2 py-1 cursor-pointe hover:bg-gray-200 dark:hover:bg-gray-600" onClick={(e) => {handleDelete(e)}}>
          <i className="bi bi-person-dash-fill mr-1"></i>Reject
        </button>
      </div>
      </div>
      <div className="absolute top-0 bottom-0 right-1 flex items-center">
        <span
          className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={(e) => {handleDelete(e)}}
        >
          x
        </span>
      </div>
    </div>
  )
}
