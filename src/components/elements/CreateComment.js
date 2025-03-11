import { useCallback, useEffect} from "react";
import EmojiPicker from 'emoji-picker-react';
import { useSelector } from "react-redux";
import { useInputHandler } from "../../hooks/useInputHandler";
import { AvatarImage } from "./AvatarImage";
import { addComment} from "../../services/commentsService";
import { addNotification } from "../../services/notificationsService";

export const CreateComment = ({postId, postAuthorId, setScrollCommentToggle}) => {
  const {
      text,
      setText,
      showPicker,
      setShowPicker,
      textareaRef,
      handleChange,
      onEmojiClick,
    } = useInputHandler();
  
  const currentUser = useSelector(state => state.authState.userInfo)

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = "40px"; 
        textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  }, [text, textareaRef]); 

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        await addComment(currentUser.id, postId, text)

        if (currentUser.id !== postAuthorId) {
          await addNotification(currentUser.id, postAuthorId, "comment", postId)
        }

        setText("");
        setShowPicker(false);
        setScrollCommentToggle((prev) => !prev);
      } catch (err) {
        console.log(err);
      }
    },
    [text, postId, postAuthorId, setScrollCommentToggle, currentUser.id, setShowPicker, setText]
  );


  return (
    <div className="flex z-30 flex-col w-full border-t pt-1 dark:border-gray-500">
      <form onSubmit={handleSubmit}>
        <div className="flex w-full">
        <AvatarImage src={currentUser?.avatar} size={8} />
        <textarea
        value={text} 
        ref={textareaRef} 
        onChange={handleChange} 
        type="text" 
        placeholder="Write a comment . . ." 
        className="ml-2 max-h-96 bg-gray-100 flex-1 pl-2 pr-4 py-2 rounded-t-xl outline-none dark:bg-gray-700 dark:text-slate-50 resize-none overflow-y-auto dark-scrollbar always-scrollbar"></textarea>
        </div>
        <div className="bg-gray-100 ml-10 rounded-b-xl flex justify-between px-2 pb-1 dark:bg-gray-700">
          <span className="relative flex items-center cursor-pointer" onClick={() => setShowPicker((prev) => (!prev))}>
            <i className="bi bi-emoji-smile dark:text-gray-300"></i>
            {showPicker && <div className="absolute top-[-80px] m-auto"><EmojiPicker onEmojiClick={onEmojiClick} /></div>}
          </span>
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
    </div>
  )
}
