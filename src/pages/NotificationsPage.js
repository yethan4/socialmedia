import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import { CommentNotificationCard, FriendRequestNotificationCard, FriendsNotificationCard, LikeNotificationCard } from "../components";
import { Sidebar } from "../components";

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  
  const userInfo = useSelector(state => state.authState.userInfo);

  useEffect(() => {
    let unsubscribe;
  
    if (userInfo) {
      const fetchNotifications = async (id) => {
        const q = query(
          collection(db, "notifications"),
          where("toUserId", "==", id),
          orderBy("timestamp", "desc"),
          limit(10)
        );
  
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const notifications = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLastVisible(notifications[notifications.length - 1]);
          setNotifications(notifications);
        });
      };
  
      fetchNotifications(userInfo.id);
    }
  
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userInfo]);
  

  return (
    <div className="flex pt-20">
      <Sidebar />

      <div className="flex-1 max-w-[1000px] pt-2 pb-6 mt-0 m-auto dark:text-slate-100 shadow dark:shadow-gray-600">
        <h1 className="text-center text-xl font-semibold py-2">ALL NOTIFICATIONS ({notifications.length})</h1>
        <div className="flex flex-col gap-2">
        {
          notifications.map((notification) => {
            if(notification.type=="like"){
              return <LikeNotificationCard key={notification.id} notification={notification} />
            }else if(notification.type=="comment"){
              return <CommentNotificationCard key={notification.id} notification={notification} />
            }else if(notification.type=="friendReqeust"){
              return <FriendRequestNotificationCard key={notification.id} notification={notification} />
            }else if(notification.type=="friends"){
              return <FriendsNotificationCard key={notification.id} notification={notification} />
            }
          })
        }
        </div>
        
      </div>
    </div>
    
  )
}
