import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useUserPresence } from "../../../hooks/useUserPresence";
import { formatTimeAgo } from "../../../utils/timeUtils";
import { Link, useNavigate } from "react-router-dom";
import { AvatarImage } from "../../../components";
import { fetchUserIfNeeded } from "../../../actions/usersAction";
import { db } from "../../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const ChatPreview = ({ chat, currentChat, isDropDown = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const withUserInfo = useSelector((state) => state.usersState.users[chat.withUserId]);
  const { isOnline } = useUserPresence(chat.withUserId);
  const currentUser = useSelector((state) => state.authState.userInfo);
  const lastMessageTime = formatTimeAgo(chat.updatedAt / 1000);

  useEffect(() => {
    dispatch(fetchUserIfNeeded(chat.withUserId));
  }, [chat.withUserId, dispatch]);

  useEffect(() => {
    if (currentChat?.chatId === chat?.chatId) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [currentChat, chat]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); 
  };

  const handleDelete = useCallback(async () => {
    const chatRef = doc(db, "chats", chat.chatId);
    const userChatRef = doc(db, "userchats", currentUser.id);
  
    const chatSnap = await getDoc(chatRef);
    const userChatSnap = await getDoc(userChatRef);
  
    if (!chatSnap.exists() || !userChatSnap.exists()) return;
  
    const chatData = chatSnap.data();
    const userChats = userChatSnap.data().chats || [];
  
    const updatedChats = userChats.filter(singleChat => singleChat.chatId !== chat.chatId);
  
    const currentTime = Date.now() / 1000;
  
    const lastClearedOther = chatData.lastClearedAt?.[chat.withUserId] || 0;
  
    if (lastClearedOther) {
      const filteredMessages = chatData.messages.filter(msg => msg.createdAt.seconds > lastClearedOther);
  
      await updateDoc(chatRef, {
        messages: filteredMessages,
        [`lastClearedAt.${currentUser.id}`]: currentTime
      });
    } else {
      await updateDoc(chatRef, {
        [`lastClearedAt.${currentUser.id}`]: currentTime
      });
    }
  
    await updateDoc(userChatRef, { chats: updatedChats });

    navigate(updatedChats.length ? `/chats/${updatedChats[0]?.withUserId}` : "/chats");
  }, [chat, currentUser, navigate]);

  return (
    <Link to={`/chats/${chat.withUserId}`}>
      <div className="relative">
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
            <span
              className={`max-w-[270px] text-xs overflow-hidden text-ellipsis whitespace-nowrap ${
                !chat.isSeen ? "font-bold" : ""
              }`}
            >
              {chat.receiverId === currentUser.id
                ? chat.lastMessage
                : `You: ${chat.lastMessage} Lorem ipsum dolor sit amet consectetur adipisicing elit.`}
            </span>
          </div>
        </div>

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

        <div className="absolute top-0 right-2 max-lg:hidden">
          <span
            className="text-sm px-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMenu} 
          >
            <i className="bi bi-three-dots"></i>
          </span>

          {isMenuOpen && (
            <div className="z-50 absolute top-6 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg w-36">
              <div 
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={handleDelete}
              >
                <span>Delete chat</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
