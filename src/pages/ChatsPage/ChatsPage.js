import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { Sidebar } from "../../components";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { useSelector } from "react-redux";
import { ChatPreview, ChatView } from "./components";

export const ChatsPage = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState("");

  const userInfo = useSelector(state => state.authState.userInfo)
  
  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", userInfo.id),
      async (res) => {
        const items = res.data().chats;

        const sortedChats = items.sort((a, b) => b.updatedAt - a.updatedAt);
      setChats(sortedChats);

      if (sortedChats.length > 0) {
        setCurrentChat(sortedChats[0]);
      }
      }
    );

    if (userInfo.id){
      return () => {
        unSub();
      };
    }
  }, [userInfo.id]);



  return (
    <div className="flex pt-20 h-screen"> 
      <div className="flex-1 flex mt-0 pl-2 dark:text-slate-100">
        <div className="w-[350px]">
          <div className="mb-2 text-center text-xl text-gray-900 font-semibold dark:text-gray-100">Chats</div>

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
          <div className="flex flex-col mt-3">
            {chats && chats.map((chat) => (
              <ChatPreview key={chat.chatId} chat={chat} />
            ))}
          </div>
        </div>
        
        {currentChat && <ChatView chatId={currentChat.chatId} chatPartnerId={currentChat.withUserId} /> }
        {/* Główny div */}
        


      </div>
    </div>
  );
};
