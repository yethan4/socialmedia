import { useEffect, useState } from "react";
import { fetchDocument } from "../../services/fetchDocument";
import { formatTimestamp } from "../../utils/timeUtils";
import { Link, useNavigate } from "react-router-dom";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteNotification } from "../../actions/notificationsAction";
import { useDispatch } from "react-redux";
import { db } from "../../firebase/config";

export const LikeNotificationCard = ({notification, setDropNotifications}) => {
  const [author, setAuthor] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formattedTime = formatTimestamp(notification.timestamp.seconds);

  useEffect(() => {
    fetchDocument(notification.fromUserId, "users").then((user) => setAuthor(user));
  }, [notification?.fromUserId])

  const handleDivClick = async(e) => {
    if (!e.target.closest("a")) {
      try{
        const notificationRef = doc(db, "notifications", notification.id)

        await updateDoc(notificationRef, {
          seen: true
        });

        setDropNotifications(false)
        navigate(`/post/${notification?.postId}`);
      }catch(e){
        console.log(e)
      }
    }
  };
  
  const handleDelete = async(e, id) => {
    e.stopPropagation();
    try{
      const document = doc(db, "notifications", id)
      await deleteDoc(document);

      dispatch(deleteNotification(id));

    }catch(err){
      console.log(err)
    }
  }

  return (
    <div
      className="relative flex items-center cursor-pointer mx-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={handleDivClick} 
    >
      <Link to={`/profile/${author?.id}`}>
        <img src={author?.avatar} alt="" className="w-12 h-12 rounded-full" />
      </Link>
      <div className="flex flex-col ml-2">
        <div>
          <Link to={`/profile/${author?.id}`}>
            <span className="font-semibold mr-1 hover:underline">{author?.username}</span>
          </Link>
          <span className="font-normal text-[10px]">{formattedTime}</span>
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