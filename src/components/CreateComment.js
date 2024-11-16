import { useEffect, useRef, useState } from "react";
import EmojiPicker from 'emoji-picker-react';

import emoji from "../assets/emoji.png";

export const CreateComment = () => {
  const [commentText, setCommentText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  
  const textareaRef = useRef();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = "40px"; 
        textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  }, [commentText]); 

  const handleChange = (event) => {
      setCommentText(event.target.value);
  };

  const onEmojiClick = (event) => {
    setCommentText((prev) => prev + event.emoji);
    setShowPicker(false);
  };

  console.log(commentText);


  return (
    <div className="flex flex-col w-full border-t pt-1">
      <div className="flex w-full">
      <img src="dog1.jpg" alt="user" className="w-8 h-8 rounded-full object-cover" />
      <textarea
      value={commentText} 
      ref={textareaRef} 
      onChange={handleChange} 
      type="text" 
      placeholder="Write a comment . . ." 
      className="ml-2 max-h-96 bg-gray-100 flex-1 pl-2 pr-4 py-2 rounded-t-xl outline-none dark:bg-gray-700 dark:text-slate-50 resize-none overflow-y-auto dark-scrollbar always-scrollbar"></textarea>
      </div>
      <div className="bg-gray-100 ml-10 rounded-b-xl flex justify-between px-2 pb-1">
        <span className="relative flex items-center cursor-pointer" onClick={() => setShowPicker((prev) => (!prev))}>
          <i className="bi bi-emoji-smile"></i>
          {showPicker && <div className="absolute top-[-80px] m-auto"><EmojiPicker onEmojiClick={onEmojiClick} /></div>}
        </span>
        {commentText ? (
          <button>
            <i className="bi bi-send-fill text-blue-600 hover:text-blue-500"></i>
          </button>
        ):(
          <button>
          <i className="bi bi-send-fill text-gray-400"></i>
        </button>
        )}  
        
      </div>
    </div>
  )
}
