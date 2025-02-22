import { useCallback, useEffect, useState } from "react";
import { deleteDocument, fetchDocument } from "../../services/oneDocumentService";
import { formatTimeAgo } from "../../utils/timeUtils";
import { Link, useNavigate } from "react-router-dom";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { AvatarImage } from "./AvatarImage";
import { fetchUserIfNeeded } from "../../actions/usersAction";
import { useDispatch, useSelector } from "react-redux";
import { markNotificationAsSeen } from "../../services/notificationsService";

export const LikeNotificationCard = ({notification, setDropNotifications=""}) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const author = useSelector((state) => state.usersState.users[notification.fromUserId])
  const formattedTime = formatTimeAgo(notification.timestamp?.seconds);

  useEffect(() => {
    dispatch(fetchUserIfNeeded(notification.fromUserId));
  }, [notification.fromUserId, dispatch]);

  const handleDivClick = useCallback(async(e) => {
    if (!e.target.closest("a")) {
      try{
        markNotificationAsSeen(notification.id)

        if(setDropNotifications){
          setDropNotifications(false)
        };

        navigate(`/post/${notification?.postId}`);
      }catch(e){
        console.log(e)
      }
    }
  }, [notification.id]);
  
  const handleDelete = useCallback( async (e, id) => {
    e.stopPropagation();
    await deleteDocument("notifications", id);
  }, []);

  return (
    <div
      className="relative flex items-center cursor-pointer mx-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={handleDivClick} 
    >
      <Link to={`/profile/${author?.id}`}>
        <AvatarImage src={author?.avatar} size={12} />
      </Link>
      <div className="flex flex-col ml-2">
        <div>
          <Link to={`/profile/${author?.id}`}>
            <span className="font-semibold mr-1 hover:underline">{author?.username}</span>
          </Link>
          <span className={notification?.seen ? "font-normal text-[10px]" : "font-normal text-[10px] text-blue-600"}>{formattedTime}</span>
        </div>
        <span>
          just liked your post!
          <i className="ml-1 bi bi-balloon-heart"></i>
        </span>
      </div>
      <div className="absolute top-0 bottom-0 right-1 flex items-center">
        <span
          className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={(e) => {handleDelete(e, notification.id)}}
        >
          x
        </span>
      </div>
    </div>
  );
};