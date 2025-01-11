import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';

import emoji from "../../assets/emoji.png";

export const CreateMessage = () => {
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const userInfo = useSelector(state => state.authState.userInfo)
  const textareaRef = useRef();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = "auto"; 
        textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  }, [text]); 

  const handleChange = (event) => {
      setText(event.target.value);
  };

  const onEmojiClick = (event) => {
    setText((prev) => prev + event.emoji);
    setShowPicker(false);
  };

  const handleImage = (event) => {
    if (event.target.files[0]){
      setImg({
        file: event.target.files[0],
        url: URL.createObjectURL(event.target.files[0]),
      });
    }
    event.target.value = ""
  };

  const handleRemoveImage = () => {
    setImg({
      file: null,
      url: "",
    })
  }

  return (
    <form className="mt-auto">
      <div className="px-2 pb-2 pt-1 flex w-full items-center border-t">
        <div className="mr-2">
          <label htmlFor="img" className="flex items-center cursor-pointer">
            <span className="px-2 rounded-full text-xl text-blue-600"><i class="bi bi-image"></i></span>
          </label>
          <input type="file" id="img" className="hidden" onChange={handleImage} />
        </div>

        <div className="relative flex flex-col flex-1 mr-2">
          <textarea 
            value={text} 
            onChange={handleChange} 
            ref={textareaRef} 
            placeholder="Send a message" 
            className="block max-h-[60vh] w-full resize-none border-0 outline-none px-4 pt-2 pb-1 rounded-xl bg-gray-100 dark:text-gray-100 dark:bg-gray-700 overflow-y-auto dark-scrollbar always-scrollbar">
          </textarea>
        </div>

        {text ? (
            <button type="submit">
              <i className="bi bi-send-fill text-blue-600 hover:text-blue-500"></i>
            </button>
          ):(
            <span>
              <i className="bi bi-send-fill text-gray-400"></i>
            </span>
          )}  
      </div>
    </form>
  )
}
