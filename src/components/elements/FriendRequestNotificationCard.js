import { Link, useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../../utils/timeUtils";
import { fetchDocument } from "../../services/oneDocumentService";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { addFriend, rejectFriendRequest } from "../../services/friendsService";
import { AvatarImage } from "./AvatarImage";

export const FriendRequestNotificationCard = ({notification, setDropNotifications}) => {
  const [author, setAuthor] = useState(null);
  
  const userInfo = useSelector(state => state.authState.userInfo);

  const navigate = useNavigate();

  const formattedTime = formatTimeAgo(notification.timestamp.seconds);

  useEffect(() => {
    fetchDocument(notification.fromUserId, "users").then((user) => setAuthor(user));
  }, [notification?.fromUserId])

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
      await rejectFriendRequest(userInfo.id, notification.fromUserId)
    }catch(err){
      console.log(err)
    }
  }, [userInfo.id, notification.fromUserId])

  const handleAccept = useCallback(async(e) => {
    e.stopPropagation();
    try{
      await addFriend(userInfo.id, notification.fromUserId)
    }catch(err){
      console.log(err)
    }
  }, [userInfo.id, notification.fromUserId])

  return (
    <div 
      className="relative flex items-center cursor-pointer mx-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={handleDivClick}
    >
      <Link to={`/profile/${author?.id}`}>
        <AvatarImage src={author?.avatar} w={12} h={12}/>
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
