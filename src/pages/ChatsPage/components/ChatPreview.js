import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useUserPresence } from "../../../hooks/useUserPresence";
import { formatTimeAgo } from "../../../utils/timeUtils";
import { Link } from "react-router-dom";
import { AvatarImage } from "../../../components";
import { fetchUserIfNeeded } from "../../../actions/usersAction";

export const ChatPreview = ({chat, currentChat, isDropDown=false}) => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const withUserInfo = useSelector((state) => state.usersState.users[chat.withUserId]);
  const { isOnline } = useUserPresence(chat.withUserId);
  const currentUser = useSelector((state) => state.authState.userInfo);
  const lastMessageTime = formatTimeAgo(chat.updatedAt / 1000);

  useEffect(() => {
    dispatch(fetchUserIfNeeded(chat.withUserId));
  }, [chat.withUserId, dispatch]);

  useEffect(() => {
    if(currentChat?.chatId===chat?.chatId) {
      setIsOpen(true)
    }else{
      setIsOpen(false)
    }
  }, [currentChat, chat])
  
  return (
    <Link to={`/chats/${chat.withUserId}`}>
      <div
        className={`flex py-2 px-1 mr-1 cursor-pointer rounded-md
          ${isOpen ? "bg-gray-200 dark:bg-gray-800" : "hover:bg-gray-200 dark:hover:bg-gray-700"}
          ${isDropDown ? "" : "max-lg:hidden"}`}
      >
        <div className="relative w-fit h-fit">
          <AvatarImage src={withUserInfo?.avatar} size={11} />
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-300 
              ${isOnline ? "bg-green-500" : "bg-gray-700"} dark:border-gray-500`}
          />
        </div>

        <div className="ml-2 flex flex-col">
          <div className="flex items-center">
            {withUserInfo?.username ? (
              <span className={!chat.isSeen ? "font-bold" : ""}>
                {withUserInfo?.username}
              </span>
            ) : (
              <div className="w-16 h-3 rounded-2xl bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
            )}
            <span className="h-fit w-fit">
              <i className="bi bi-dot"></i>
            </span>
            <span className="text-[9px]">{lastMessageTime}</span>
            {!chat.isSeen && (
              <span className="mb-1 ml-2 w-1 h-1 rounded-full bg-blue-500"></span>
            )}
          </div>
          <span className={`max-w-[270px] text-xs overflow-hidden text-ellipsis whitespace-nowrap ${!chat.isSeen ? "font-bold" : ""}`}>
            {chat.receiverId === currentUser.id ? chat.lastMessage : `You: ${chat.lastMessage}`}
          </span>
        </div>
      </div>

      {/* Ukrywamy mobilny layout jeśli to jest DropDown */}
      {!isDropDown && (
        <div
          className={`flex py-2 px-1 mr-1 cursor-pointer rounded-md 
            ${isOpen ? "bg-gray-200 dark:bg-gray-800" : "hover:bg-gray-200 dark:hover:bg-gray-700"} lg:hidden`}
        >
          <div
            className={`relative w-fit h-fit ${
              chat.isSeen ? "" : "bg-blue-500 rounded-xl"
            }`}
          >
            <img
              src={withUserInfo?.avatar}
              alt=""
              className="object-cover w-11 h-11 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700"
            />
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-300 
                ${isOnline ? "bg-green-500" : "bg-gray-700"} dark:border-gray-500`}
            />
          </div>
        </div>
      )}
    </Link>
  )
}
