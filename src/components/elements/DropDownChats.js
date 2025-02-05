import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useSearchUsers from "../../hooks/useSearchUsers";
import { ChatPreview } from "../../pages/ChatsPage/components";

export const DropDownChats = () => {
  const [currentChat, setCurrentChat] = useState("");
  const [input, setInput] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);

  const chats = useSelector((state) => state.chatsState.chats)
  const searchResults = useSearchUsers(input);

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
    <div className="max-sm:w-full max-sm:px-2 absolute flex flex-col gap-2 top-[62px] right-2 w-96 pb-2 px-2 h-fit max-h-[600px] rounded border-b border-l shadow bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 overflow-y-auto dark-scrollbar always-scrollbar">
      
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
      
      <div className="flex flex-col mt-3 gap-1">
        {filteredChats.length > 0 ? (
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
  )
}
