import React, { useEffect, useRef, useState } from 'react';
import { CreateMessage, MessageCard, ChatInfo } from './';
import { useSelector } from 'react-redux';
import { useUserPresence } from '../../../hooks/useUserPresence';
import { Link } from 'react-router-dom';
import { TypingIndicator } from '../../../animations/TypingIndicator';
import { formatDisplayDate } from '../../../utils/timeUtils';
import { AvatarImage } from '../../../components';
import { getChat, markChatAsSeen, updateUserChatStatus, checkIfSeen } from '../../../services/chatService';
import { useBlockStatus } from '../../../hooks/useBlockStatus';
import { unblockUserInChat } from '../../../services/usersService';

export const ChatView = ({ chatId, chatPartnerId }) => {
  const [chat, setChat] = useState({ messages: [] });
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [isSeen, setIsSeen] = useState(false);

  const {blockStatus, updateBlockStatus} = useBlockStatus(chatPartnerId);

  const endRef = useRef(null);
  const chatContainerRef = useRef(null);

  const { isOnline, lastActive } = useUserPresence(chatPartnerId);
  const currentUser = useSelector((state) => state.authState.userInfo);
  const chatPartner = useSelector((state) => state.usersState.users[chatPartnerId]);

  useEffect(() => {
    setIsFirstLoad(true);
  }, [chatId]);

  useEffect(() => {
    const unsubscribe = getChat(chatId, setChat);
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (endRef.current && chat.messages.length > 0) {
      if (isFirstLoad) {
        setIsFirstLoad(false);
        setTimeout(() => {
          endRef.current.scrollIntoView({ block: 'end' });
        }, 100);
      } else if (isAtBottom) {
        endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, [chat.messages, isAtBottom, isFirstLoad]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    const handleScroll = () => {
      if (chatContainer) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainer;
        setIsAtBottom(scrollHeight - (scrollTop + clientHeight) < 40);
      }
    };

    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateUserChatStatus(currentUser.id, chatId);
        markChatAsSeen(chatId, currentUser.id);
      }
    };
  
    // Obsługa zmiany widoczności dokumentu
    document.addEventListener("visibilitychange", handleVisibilityChange);
  
    // Wywołanie również na zmianę wiadomości (np. gdy przychodzi nowa)
    if (!document.hidden) {
      updateUserChatStatus(currentUser.id, chatId);
      markChatAsSeen(chatId, currentUser.id);
    }
  
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [chat.messages, chatId, currentUser.id]);

  useEffect(() => {
    if (!chatId) return;
    return checkIfSeen(chatId, chatPartnerId, setIsSeen);
  }, [chatId, chatPartnerId]);

  const lastClearedAt = chat?.lastClearedAt?.[currentUser.id] || 0;
  const filteredMessages = chat.messages.filter(
    (message) => message.createdAt.seconds > lastClearedAt
  );

  return (
    <div className="flex-1 h-full border-l flex dark:border-gray-700">
      <div className="flex-1 h-full border-l flex flex-col dark:border-gray-700">
        <div className="pl-2 py-2 flex shadow dark:shadow-gray-800">
          <Link to={`/profile/${chatPartner?.id}`}>
            <div className="relative w-fit h-fit">
              <AvatarImage src={chatPartner?.avatar} size={12} />
              {isOnline ? (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-400 bg-green-500 dark:border-gray-500"></div>
              ) : (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-300 bg-gray-700 dark:border-gray-500"></div>
              )}
            </div>
          </Link>
          <div className="flex flex-col ml-2 justify-center">
            <Link to={`/profile/${chatPartner?.id}`}>
              <span className="text-lg font-semibold cursor-pointer">{chatPartner?.username}</span>
            </Link>
            {isOnline ? (
              <span className="text-xs font-medium text-green-500">Online</span>
            ) : (
              <span className="text-xs font-medium text-gray-500">{lastActive}</span>
            )}
          </div>
          <div className="ml-auto pr-2 h-full flex items-center">
            <span 
              onClick={() => setShowChatInfo((prev) => !prev)}
              className="px-2 py-1 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </span>
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className="mt-3 flex gap-2 flex-col w-full px-4 flex-1 overflow-y-auto dark-scrollbar always-scrollbar"
        >
          {filteredMessages.map((message, index) => {
            const prevMessage = index > 0 ? filteredMessages[index - 1] : null;
            const formattedDate =
              index === 0 || (prevMessage && message.createdAt.seconds - prevMessage.createdAt.seconds > 1000)
                ? formatDisplayDate(message.createdAt.seconds)
                : null;

            return (
              <React.Fragment key={index}>
                {formattedDate && <div className="w-full text-center text-xs my-2">{formattedDate}</div>}
                <MessageCard
                  message={message}
                  chatPartner={message.senderId !== currentUser.id ? chatPartner : null}
                />
              </React.Fragment>
            );
          })}

          {!isSeen && filteredMessages.length > 0 && filteredMessages[filteredMessages.length - 1]?.senderId === currentUser.id && (
            <span className="ml-auto mt-[-4px] text-sm dark:text-gray-400">
              <i className="bi bi-check-circle mr-1"></i>
              Delivered
            </span>
          )}

          {isSeen && filteredMessages.length > 0 && filteredMessages[filteredMessages.length - 1]?.senderId === currentUser.id && (
            <span className="ml-auto mt-[-4px] text-sm text-gray-600 dark:text-gray-400">
              <i className="bi bi-check-circle-fill mr-1"></i>
              Seen
            </span>
          )}

          {chat?.currentlyTyping?.includes(chatPartnerId) && (
            <div className="flex h-fit mt-2 items-center">
              <img src={chatPartner.avatar} alt="" className="w-8 h-8 object-cover rounded-full mr-2"/>
              <TypingIndicator />
            </div>
          )}

          <div ref={endRef}></div>
        </div>

        {!blockStatus.hasCuBlockedChat && !blockStatus.isCuChatBlocked  && (<CreateMessage chatId={chatId} chatPartnerId={chatPartnerId} />)}
        {blockStatus.hasCuBlockedChat && (
          <div className="py-8 border-t dark:border-gray-500 flex flex-col items-center">
            <span>If you want to continue the conversation, unblock {chatPartner?.username}.</span>
            <button 
              className="px-10 py-2 mt-2 font-bold text-white bg-gray-500 dark:bg-gray-700 rounded-xl hover:bg-gray-600"
              onClick={() => {
                unblockUserInChat(currentUser.id, chatPartnerId);
                updateBlockStatus("hasCuBlockedChat", false);
              }}
              >Unblock</button>
          </div>
        )}
        {!blockStatus.hasCuBlockedChat && blockStatus.isCuChatBlocked && (
          <div className="py-8 border-t dark:border-gray-500 flex flex-col items-center">
            <span className="font-semibold text-red-500">{chatPartner?.username} blocked you</span>
          </div>
        )}
      </div>

      {showChatInfo && <ChatInfo chat={chat} chatPartner={chatPartner} hasCuBlockedChat={blockStatus.hasCuBlockedChat} lastClearedAt={lastClearedAt} />}
    </div>
  );
};
