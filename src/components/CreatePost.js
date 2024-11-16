import { useEffect, useRef, useState } from "react";
import EmojiPicker from 'emoji-picker-react';

import emoji from "../assets/emoji.png";
import upload from "../assets/upload.png";


export const CreatePost = () => {
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

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
    <div className="min-w-[700px] bg-white shadow mx-auto p-2 py-4 rounded-xl dark:bg-gray-800 max-lg:min-w-[480px]">
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-2">
          <img src="avatar.jpg" alt="" className="object-cover w-10 h-10 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700" />
          <span className="text-gray-900 dark:text-gray-200 font-bold">Johny Jhony</span>
        </span>
        {img.url && 
        <div className="">
          <div className="bg-gray-300 w-fit relative">
            <img src={img.url} alt="" className="max-w-[400px] max-h-[400px]"/>
            <i class="bi bi-x-lg absolute top-1 right-1 px-1 text-gray-600 bg-slate-200 bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-60" onClick={handleRemoveImage}></i>
          </div>
        </div>}
        <textarea 
          value={text} 
          onChange={handleChange} 
          ref={textareaRef} 
          placeholder="What's Up?" 
          className="block h-10 max-h-[60vh] w-full resize-none border-0 outline-none px-4 py-2 rounded-xl bg-gray-100 dark:text-gray-100 dark:bg-gray-700 overflow-y-auto dark-scrollbar always-scrollbar">
        </textarea>
      </div>
      <div className="mt-3 flex justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex items-center cursor-pointer" onClick={() => setShowPicker((prev) => (!prev))}>
            <img src={emoji} alt="" className="w-6 h-6"/>
            <p className="ml-1 text-sm dark:text-gray-300">Emoji</p>
            {showPicker && <div className="absolute top-[-80px] m-auto"><EmojiPicker onEmojiClick={onEmojiClick} /></div>}
          </span>
          <label htmlFor="img" className="flex items-center cursor-pointer">
            <img src={upload} alt="" className="w-6 h-6"/>
            <p className="ml-1 text-sm dark:text-gray-300">Add Photo</p>
          </label>
          <input type="file" id="img" className="hidden" onChange={handleImage}/>
        </div>
        <div>
          { text || img.url ? (
            <button className="bg-blue-700 text-white py-1 px-4 rounded-2xl hover:bg-blue-600">Share</button>
          ):(
            <button 
          className="bg-gray-700 text-white py-1 px-4 rounded-2xl cursor-default">Share</button>
          )}
        </div>
      </div>
    </div>
  )
}
