import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatPreview, ChatView } from "./components";
import { useParams } from "react-router-dom";
import { useTitle } from "../../hooks/useTitle";
import useSearchUsers from "../../hooks/useSearchUsers";
import { setCurrentChat, setLoading } from "../../actions/chatsAction";

export const ChatsPage = () => {
  const { id } = useParams();
  const [input, setInput] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);

  const dispatch = useDispatch();
  const { chats, currentChat, loading }= useSelector(state => state.chatsState)

  const searchResults = useSearchUsers(input);
  
  useTitle("- Chats");

  useEffect(() => {
    if (!id || !chats.length) return; 
  
    dispatch(setLoading(true));
  
    const chat = chats.find((chat) => chat.withUserId === id);
    if (chat) {
      dispatch(setCurrentChat(chat));
    } else if (chats.length > 0) {
      dispatch(setCurrentChat(chats[0]));
    } else {
      dispatch(setCurrentChat(null));
    }
  
    dispatch(setLoading(false));
  }, [id, chats]);

  useEffect(() => {
    if (searchResults.length > 0) {
      const filtered = chats.filter((chat) => {
        return searchResults.some(
          (user) => user.id === chat.withUserId
        );
      });
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats);
    }
  }, [searchResults, chats]);

  return (
    <div className="flex pt-[62px] h-screen">
      <div className="flex-1 flex mt-0 pl-2 dark:text-slate-100">
        <div className="lg:w-[350px] max-lg:w-[60px]">
          <div className="mb-2 mt-4 text-center text-xl text-gray-900 font-semibold dark:text-gray-100">
            Chats
          </div>

          <div className="relative flex flex-col">
            <i className="bi bi-search absolute top-1 left-2 text-gray-400"></i>
            <input
              name="search"
              type="text"
              className="pl-8 py-1 mr-2 text-md text-gray-700 shadow rounded-xl outline-none focus:ring-2 ring-gray-200 dark:bg-gray-800 dark:text-slate-100 dark:ring-gray-700"
              placeholder="Search in chats"
              autoComplete="off"
              onChange={(e) => setInput(e.target.value)} 
              value={input}
            />
          </div>

          {/* Chats */}
          <div className="flex flex-col mt-3 gap-1">
            {filteredChats?.length > 0 ? (
              filteredChats.map((chat) => (
                <ChatPreview
                  key={chat.chatId}
                  chat={chat}
                  currentChat={currentChat}
                />
              ))
            ) : (
              <p className="px-4 py-2 text-gray-500">No chats found.</p>
            )}
          </div>
        </div>
        { loading && <div>
          Loading</div>}
        {currentChat && !loading && (
          <ChatView
            chatId={currentChat.chatId}
            chatPartnerId={currentChat.withUserId}
          />
        )}
      </div>
    </div>
  );
};
