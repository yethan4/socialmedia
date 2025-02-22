import { useEffect, useRef, useState } from "react";
import EmojiPicker from 'emoji-picker-react';

import emoji from "../../assets/emoji.png";
import upload from "../../assets/upload.png";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../../services/imageService";
import { toast } from "react-toastify";
import { addNewPost } from "../../actions/postsAction";
import { Link } from "react-router-dom";
import { useInputHandler } from "../../hooks/useInputHandler";
import { AvatarImage } from "./AvatarImage";
import { addPost } from "../../services/postsService";

export const CreatePost = () => {
  const {
      text,
      setText,
      showPicker,
      setShowPicker,
      img,
      setImg,
      textareaRef,
      handleChange,
      onEmojiClick,
      handleImage,
      handleRemoveImage,
    } = useInputHandler();
  const [visibility, setVisibility] = useState("friends");
  const [showList, setShowList] = useState(false); //who can see the post

  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.authState.userInfo);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = "auto"; 
        textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  }, [text]); 

  const handleSubmit = async(e) => {
    e.preventDefault();
    let imgUrl = ""
    
    try{
      if(img.file){
        imgUrl = await uploadImage(img.file)
      }

      const postData = await addPost(text, currentUser.id, imgUrl, visibility)

      dispatch(addNewPost(postData));
      
      toast.success("Post created successfully!")
      setText("");
      setImg({ file: null, url: "" });
      setShowPicker(false);

    }catch(err){
      console.log(err)
      toast.error("Something went wrong.")
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white shadow mx-auto p-2 py-4 rounded-xl dark:bg-gray-800 max-lg:max-w-[480px] mb-4">
      <div className="flex flex-col gap-2">
        <div className="relative flex">
          <Link to={`/profile/${currentUser?.id}`}>
          <span className="flex items-center gap-2">
            <AvatarImage src={currentUser?.avatar} size={10}/>
            <span className="text-gray-900 dark:text-gray-200 font-bold">{currentUser.username}</span>
          </span>
          </Link>
          <div className="absolute right-2 top-2 flex gap-1">
            <div className="flex justify-center gap-1 px-2 rounded-xl bg-gray-100 dark:text-gray-50 dark:bg-gray-700 select-none">
              <i className={visibility === "friends" ? "bi bi-people" : "bi bi-globe"}></i>
              <span>{visibility === "friends" ? "Friends" : "Public"}</span>
            </div>
            <div className="px-1 rounded-full bg-gray-100 dark:text-gray-50 dark:bg-gray-700 cursor-pointer select-none" onClick={() => setShowList(() => !showList)}>
              {showList ? (
                <span className="text-xs"><i className="bi bi-caret-up-fill"></i></span>
              ) : (
                <span className="text-xs"><i className="bi bi-caret-down-fill"></i></span>
              )}
            </div>
          </div>
          {showList && (<div className="absolute z-40 right-1 top-10 dark:bg-gray-800 py-1 flex flex-col rounded border bg-white dark:text-gray-200 dark:border-gray-700">
            <span className="px-2 py-2 select-none cursor-default">Who can see the post?</span>
            <div className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer" onClick={() => setVisibility("friends")}>
              <i className="mr-1 bi bi-people"></i>
              <span>Friends</span>
            </div>
            <div className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer" onClick={() => setVisibility("public")}>
              <i className="mr-1 bi bi-globe"></i>
              <span>Public</span>
            </div>
          </div> )} 
        </div>
        {img.url &&  
        <div className="">
          <div className="bg-gray-300 w-fit relative">
            <img src={img?.url} alt="" className="max-w-[400px] max-h-[400px]"/>
            <i className="bi bi-x-lg absolute top-1 right-1 px-1 text-gray-600 bg-slate-200 bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-60" onClick={handleRemoveImage}></i>
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
          <span className="relative flex items-center cursor-pointer z-30" onClick={() => setShowPicker((prev) => (!prev))}>
            <img src={emoji} alt="" className="w-6 h-6"/>
            <p className="ml-1 text-sm dark:text-gray-300">Emoji</p>
            {showPicker && <div className="absolute top-[-80px] m-auto">
              <EmojiPicker 
                onEmojiClick={onEmojiClick} 
                theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
              />
            </div>}
          </span>
          <label htmlFor="img" className="flex items-center cursor-pointer">
            <img src={upload} alt="" className="w-6 h-6"/>
            <p className="ml-1 text-sm dark:text-gray-300">Add Photo</p>
          </label>
          <input type="file" id="img" className="hidden" onChange={handleImage} accept="image/jpeg, image/png, image/gif" />
        </div>
        <div>
          {text || img.url ? (
            <button type="submit" className="bg-blue-700 text-white py-1 px-4 rounded-2xl hover:bg-blue-600">Share</button>
          ) : (
            <button type="button" className="bg-gray-700 text-white py-1 px-4 rounded-2xl cursor-default">Share</button>
          )}
        </div>
      </div>
    </form>
  );
}
