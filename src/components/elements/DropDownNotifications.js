import { useSelector } from "react-redux"
import { CommentNotificationCard, FriendsNotificationCard } from "../"
import { LikeNotificationCard } from "../"
import { FriendRequestNotificationCard } from "../"

export const DropDownNotifications = ({setDropNotifications}) => {
  const notifications = useSelector(state => state.notificationsState.notifications);

  return (
    <div className="max-sm:w-full max-sm:px-2 absolute flex flex-col gap-2 top-[62px] right-2 w-96 pb-2 h-fit max-h-[400px] rounded border-b border-l shadow bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 overflow-y-auto dark-scrollbar always-scrollbar">
      <span className="text-xl font-semibold mt-2 ml-2  ">Notifications</span>
      
      {
        notifications.map((notification) => {
          if(notification.type=="like"){
            return <LikeNotificationCard key={notification.id} notification={notification} setDropNotifications={setDropNotifications}/>
          }else if(notification.type=="comment"){
            return <CommentNotificationCard key={notification.id} notification={notification} setDropNotifications={setDropNotifications} />
          }else if(notification.type=="friendRequest"){
            return <FriendRequestNotificationCard key={notification.id} notification={notification} setDropNotifications={setDropNotifications} />
          }else if(notification.type=="friends"){
            return <FriendsNotificationCard key={notification.id} notification={notification} setDropNotifications={setDropNotifications} />
          }
        })
      }

      {notifications.length == 0 && <div className="px-2">no new notifications</div>}

    </div>
  )
}
