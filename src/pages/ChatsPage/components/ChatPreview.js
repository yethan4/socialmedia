import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { fetchDocument } from "../../../services/fetchDocument";
import { useUserPresence } from "../../../hooks/useUserPresence";
import { formatTimestamp } from "../../../utils/timeUtils";

export const ChatPreview = ({chat}) => {
  const [withUserInfo, setWithUserInfo] = useState();

  const { isOnline, lastActive } = useUserPresence(chat.withUserId);

  const currentUser = useSelector(state => state.authState.userInfo)

  const lastMessageTime = formatTimestamp(chat.updatedAt/1000)

  useEffect(() => {
    fetchDocument(chat.withUserId, "users").then((user) => {
      setWithUserInfo(user);
    })
  }, [chat])



  return (
    <div className="flex py-2 px-1 cursor-pointer rounded-md hover:bg-gray-300 dark:hover:bg-gray-700">
      <div className="relative w-fit h-fit">
        <img
          src={withUserInfo?.avatar}
          alt=""
          className="object-cover w-11 h-11 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700"
        />
        {isOnline ? (
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-300 bg-green-500 dark:border-gray-500">
          </div>
        ) : (
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-300 bg-gray-700 dark:border-gray-500">
          </div>
        )}
      </div>

      <div className="ml-2 flex flex-col">
        <div className="flex items-center">
          <span>{withUserInfo?.username}</span>
          <span className="h-fit w-fit">
            <i className="bi bi-dot"></i>
          </span>
          <span className="text-[9px]">{lastMessageTime}</span>
        </div>
        {chat.receiverId != currentUser.id ? (
        <span className={chat.isSeen ? "max-w-[270px] text-xs overflow-hidden text-ellipsis whitespace-nowrap" : "max-w-[270px] text-xs font-bold overflow-hidden text-ellipsis whitespace-nowrap"}>
          {chat.lastMessage}
        </span>
        ) : (
        <span className="max-w-[270px] text-xs overflow-hidden text-ellipsis whitespace-nowrap">
          You: {chat.lastMessage}
        </span>
        )}
        
      </div>
    </div>
  )
}
