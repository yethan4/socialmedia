import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { CommentNotificationCard, FriendRequestNotificationCard, FriendsNotificationCard, InfiniteScrollObserver, Layout, LikeNotificationCard } from "../components";
import { getNotifications } from "../services/notificationsService";

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [lastVisibleNotification, setLastVisibleNotification] = useState(null);
  const [noMore, setNoMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  
  const currentUser = useSelector(state => state.authState.userInfo);

  useEffect(() => {
    if (deletedId) {
      setNotifications((prevNotifications) =>
        prevNotifications.filter(notification => notification.id !== deletedId)
      );
    }
  }, [deletedId]);

  useEffect(() => {
    if(!currentUser.id) return;
    
    const fetchNotifications = async (id) => {
      const { notifications, lastVisible } = await getNotifications({id})
      

      if(notifications.length>0){
        setLastVisibleNotification(lastVisible);
        setNotifications(notifications);
      }
    }

    fetchNotifications(currentUser.id);
  
  }, [currentUser.id]);

  const loadMoreNotifications = async () => {
      if (!lastVisibleNotification) {
        setNoMore(true);
        return;
      }
  
      setLoading(true);
  
      try {
        const {notifications, lastVisible} = await getNotifications({id:currentUser.id, fromDoc:lastVisibleNotification})
          if(notifications.length>0){
            setNotifications((prevNotifications) => [...prevNotifications, ...notifications])
            setLastVisibleNotification(lastVisible);
          }else{
            setNoMore(true);
          }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto px-4">
      <div className="pt-2 pb-6 w-full mt-0 dark:text-slate-100">
        <h1 className="text-center text-xl font-semibold py-2">ALL NOTIFICATIONS</h1>
        <div className="flex flex-col gap-2">
          {notifications.map((notification) => {
            if (notification.type === "like") {
              return <LikeNotificationCard key={notification.id} notification={notification} setDeletedId={setDeletedId} />;
            } else if (notification.type === "comment") {
              return <CommentNotificationCard key={notification.id} notification={notification} setDeletedId={setDeletedId} />;
            } else if (notification.type === "friendReqeust") {
              return <FriendRequestNotificationCard key={notification.id} notification={notification} setDeletedId={setDeletedId} />;
            } else if (notification.type === "friends") {
              return <FriendsNotificationCard key={notification.id} notification={notification} setDeletedId={setDeletedId} />;
            }
          })}
        </div>
      </div>
      {lastVisibleNotification && (
        <InfiniteScrollObserver loadMore={loadMoreNotifications} loading={loading} hasMore={!noMore} />
      )}
    </div>

  )
}
