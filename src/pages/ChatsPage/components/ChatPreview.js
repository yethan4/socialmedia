import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { fetchDocument } from "../../../services/oneDocumentService";
import { useUserPresence } from "../../../hooks/useUserPresence";
import { formatTimeAgo } from "../../../utils/timeUtils";
import { Link } from "react-router-dom";
import { AvatarImage } from "../../../components";

export const ChatPreview = ({chat, currentChat}) => {
  const [withUserInfo, setWithUserInfo] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const { isOnline } = useUserPresence(chat.withUserId);

  const currentUser = useSelector(state => state.authState.userInfo)

  const lastMessageTime = formatTimeAgo(chat.updatedAt/1000)

  useEffect(() => {
    fetchDocument(chat.withUserId, "users").then((user) => {
      setWithUserInfo(user);
    })
  }, [chat])

  useEffect(() => {
    if(currentChat?.chatId===chat?.chatId) {
      setIsOpen(true)
    }else{
      setIsOpen(false)
    }
  }, [currentChat, chat])
  
  return (
    <Link to={`/chats/${chat.withUserId}`}>
      <div className={isOpen ? "flex py-2 px-1 mr-1 cursor-pointer rounded-md shadow bg-gray-200 dark:bg-gray-800 max-lg:hidden" : "flex py-2 px-1 mr-1 cursor-pointer rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 max-lg:hidden"}>
        <div className="relative w-fit h-fit">
          <AvatarImage src={withUserInfo?.avatar} size={11} />
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
            {withUserInfo?.username ? (
              <span className={!chat.isSeen && "font-bold"}>{withUserInfo?.username}</span>
            ) : (
              <div className="w-16 h-3 rounded-2xl bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
            )}
            <span className="h-fit w-fit">
              <i className="bi bi-dot"></i>
            </span>
            <span className="text-[9px]">{lastMessageTime}</span>
            {!chat.isSeen && (<span className="mb-1 ml-2 w-1 h-1 rounded-full bg-blue-500"></span>)}
          </div>
          {chat.receiverId === currentUser.id ? (
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

      <div className={isOpen ? "flex py-2 px-1 mr-1 cursor-pointer rounded-md shadow bg-gray-200 dark:bg-gray-800 lg:hidden" : "flex py-2 px-1 mr-1 cursor-pointer rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden"}>
        <div className={chat.isSeen ? "relative w-fit h-fit" : "relative w-fit h-fit bg-blue-500 rounded-xl"}>
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

      </div>
    </Link>
  )
}
