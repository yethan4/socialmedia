import React, { useEffect, useState } from 'react'
import { CreateMessage, MessageCard } from './'
import { doc, onSnapshot } from 'firebase/firestore';
import { database, db } from '../../../firebase/config';
import { fetchDocument } from '../../../services/fetchDocument';
import { useSelector } from 'react-redux';
import { useUserPresence } from '../../../hooks/useUserPresence';
import { Link } from 'react-router-dom';

export const ChatView = ({chatId, chatPartnerId}) => {
  const [chat, setChat] = useState([]);
  const [chatPartner, setChatPartner] = useState([]);

  const { isOnline, lastActive } = useUserPresence(chatPartnerId);

  const currentUser = useSelector(state => state.authState.userInfo);

 
  
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    if(chatPartnerId){
      fetchDocument(chatPartnerId, "users").then((user) => {
        setChatPartner(user);
      })
    }
  }, [chatPartnerId])


  return (
    <div className="flex-1 h-full border-l flex flex-col dark:border-gray-700">
          {/* chatPartner info */}
          <div className="pl-2 py-2 flex shadow dark:shadow-gray-800">
            <Link to={`/profile/${chatPartner.id}`}>
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
              <Link to={`/profile/${chatPartner.id}`}>
              <span className="text-lg font-semibold cursor-pointer">{chatPartner?.username}</span>
              </Link>
              {isOnline ? (
                <span className="text-xs font-medium text-green-500">Now</span>
              ):(
                <span className="text-xs font-medium text-gray-500">{lastActive}</span>
              )}
            </div>
            <div className="ml-auto pr-2 h-full flex items-center">
              <span className="px-2 py-1 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
              <i className="bi bi-three-dots-vertical"></i>
              </span>
            </div>
          </div>
          
          {/* chat messages*/}
          <div className="mt-3 flex gap-2 flex-col w-full px-4 pb-4 flex-1 overflow-y-auto dark-scrollbar always-scrollbar">
            
            {chat.messages && chatPartner && currentUser && chat.messages.map((message, index) => (
              
              message.senderId === currentUser.id ? 
              <MessageCard key={index} message={message} /> 
              : <MessageCard key={index} message={message} chatPartner={chatPartner}/>
            ))}

          </div>

          {/* */}
          <CreateMessage chatId={chatId} chatPartnerId={chatPartnerId}/>
          
        </div>
  )
}
