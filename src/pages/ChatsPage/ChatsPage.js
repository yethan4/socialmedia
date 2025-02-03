import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { useSelector } from "react-redux";
import { ChatPreview, ChatView } from "./components";
import { useParams } from "react-router-dom";
import { useTitle } from '../../hooks/useTitle';

export const ChatsPage = () => {
  const { id } = useParams();

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState("");

  const userInfo = useSelector(state => state.authState.userInfo)
  
  useTitle("- Chats")

  useEffect(() => {
    const findChatById = () => {
      const chat = chats.find(chat => chat.withUserId === id);
      if(chat) {
        setCurrentChat(chat)
        
      }else{
        if(chats.length>0){
          setCurrentChat(chats[0])
        }
      }
    }

    findChatById();
  }, [chats, id])

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", userInfo.id),
      async (res) => {
        const items = res.data().chats;

        const sortedChats = items.sort((a, b) => b.updatedAt - a.updatedAt);
      setChats(sortedChats);
      }
    );

    if (userInfo.id){
      return () => {
        unSub();
      };
    }
  }, [userInfo.id]);



  return (
    <div className="flex pt-[62px] h-screen"> 
      <div className="flex-1 flex mt-0 pl-2 dark:text-slate-100">
        <div className="lg:w-[350px] max-lg:w-[60px]">
          <div className="mb-2 mt-4 text-center text-xl text-gray-900 font-semibold dark:text-gray-100">Chats</div>

          <div className="relative flex flex-col">
            <i className="bi bi-search absolute top-1 left-2 text-gray-400"></i>
            <input
              name="search"
              type="text"
              className="pl-8 py-1 mr-2 text-md text-gray-700 shadow rounded-xl outline-none focus:ring-2 ring-gray-200 dark:bg-gray-800 dark:text-slate-100 dark:ring-gray-700"
              placeholder="Search in chats"
              autoComplete="off"
            />
          </div>

          {/* Chats */}
          <div className="flex flex-col mt-3 gap-1">
            {chats && chats.map((chat) => (
              <ChatPreview key={chat.chatId} chat={chat} currentChat={currentChat} />
            ))}
          </div>
        </div>
        
        {currentChat && <ChatView chatId={currentChat.chatId} chatPartnerId={currentChat.withUserId} /> }
      </div>
    </div>
  );
};
