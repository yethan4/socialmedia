import React, { useEffect, useRef, useState } from 'react';
import { CreateMessage, MessageCard, ChatInfo } from './';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { fetchDocument } from '../../../services/fetchDocument';
import { useSelector } from 'react-redux';
import { useUserPresence } from '../../../hooks/useUserPresence';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { TypingIndicator } from '../../../animations/TypingIndicator';

export const ChatView = ({ chatId, isSeen, chatPartnerId }) => {
  const [chat, setChat] = useState({ messages: [] });
  const [chatPartner, setChatPartner] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [showChatInfo, setShowChatInfo] = useState(false);

  const endRef = useRef(null);
  const chatContainerRef = useRef(null);

  const { isOnline, lastActive } = useUserPresence(chatPartnerId);
  const currentUser = useSelector((state) => state.authState.userInfo);

  useEffect(() => {
    setIsFirstLoad(true)
  }, [chatId])

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
    const unsubscribe = onSnapshot(doc(db, 'chats', chatId), (doc) => {
      setChat(doc.data() || { messages: [] });
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (chatPartnerId) {
      fetchDocument(chatPartnerId, 'users').then((user) => {
        setChatPartner(user);
      });
    }
  }, [chatPartnerId]);

  
  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    const handleScroll = () => {
      if (chatContainer) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainer;
        const isBottom = scrollHeight - (scrollTop + clientHeight) < 40; // Margines błędu
        setIsAtBottom(isBottom);
        //console.log('ScrollTop:', scrollTop, 'ScrollHeight:', scrollHeight, 'ClientHeight:', clientHeight, 'IsBottom:', isBottom);
      }
    };

    chatContainer.addEventListener('scroll', handleScroll);
    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateSeenStatus = async (chatPartnerId, chatId) => {
      if(document.hidden) return;

      const docRef = doc(db, "userchats", chatPartnerId);

      try{
        const docSnap = await getDoc(docRef);
  
        if(docSnap.exists()){
          const data = docSnap.data();
          const updatedChats = data.chats.map(chat => chat.chatId === chatId ? { ...chat, isSeen:true } : chat)

          await updateDoc(docRef, { chats: updatedChats });
          console.log("dziala")
        }
      }catch(err){
        console.log(err)
      }
    }

    updateSeenStatus(chatPartnerId, chatId)
    
  }, [chat.messages, chatId, chatPartnerId, document.hidden])

  return (
    <div className="flex-1 h-full border-l flex dark:border-gray-700">

      <div className="flex-1 h-full border-l flex flex-col dark:border-gray-700">
        {/* Informacje o partnerze czatu */}
        <div className="pl-2 py-2 flex shadow dark:shadow-gray-800">
          <Link to={`/profile/${chatPartner?.id}`}>
            <div className="relative w-fit h-fit">
              <img
                src={chatPartner?.avatar}
                alt=""
                className="object-cover w-12 h-12 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700"
              />
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

        {/* Wiadomości */}
        <div
          ref={chatContainerRef}
          className="mt-3 flex gap-2 flex-col w-full px-4 flex-1 overflow-y-auto dark-scrollbar always-scrollbar"
        >
          {chat.messages &&
            chatPartner &&
            currentUser &&
            chat.messages.map((message, index) =>
              message.senderId === currentUser.id ? (
                <MessageCard key={index} message={message} />
              ) : (
                <MessageCard key={index} message={message} chatPartner={chatPartner} />
              )
            )}

          {!isSeen && chat?.messages[chat?.messages?.length - 1]?.senderId === currentUser.id && (
            <span className="ml-auto mt-[-4px] text-sm dark:text-gray-400">
              <i className="bi bi-check-circle mr-1"></i>
              Delivered
            </span>
          )}

          {isSeen && chat?.messages[chat?.messages?.length - 1]?.senderId === currentUser.id && (
            <span className="ml-auto mt-[-4px] text-sm text-gray-600 dark:text-gray-400">
              <i className="bi bi-check-circle-fill mr-1"></i>
              Seen
            </span>
          )}

          {chat?.currentlyTyping?.includes(chatPartnerId) && (
            <div className="flex h-fit mt-2 items-center">
              <img src={chatPartner.avatar} alt="" className="w-8 h-8 object-cover rounded-full mr-2 "/>
              <TypingIndicator />
            </div>
          )}

          <div ref={endRef}></div>
        </div>

        {/* Pole do tworzenia wiadomości */}
        <CreateMessage chatId={chatId} chatPartnerId={chatPartnerId} />
      </div>

      { showChatInfo && (<ChatInfo chat={chat} chatPartner={chatPartner} />)}

    </div>
  );
};