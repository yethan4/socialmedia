import EmojiPicker from "emoji-picker-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import emoji from "../../../assets/emoji.png";
import { uploadImage } from "../../../services/imageService";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useInputHandler } from "../../../hooks/useInputHandler";

export const CreateMessage = ({ chatId, chatPartnerId }) => {
  const [isSending, setIsSending] = useState(false);
  const currentUser = useSelector((state) => state.authState.userInfo);

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

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text, textareaRef]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (text === "" && img.url === "") return;

    if (isSending) return;

    setIsSending(true);

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await uploadImage(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
        seenBy: [currentUser.id]
      });

      const userIDs = [currentUser.id, chatPartnerId];

      for (const id of userIDs) {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);
      
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
      
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
      
          if (chatIndex !== -1) {
            userChatsData.chats[chatIndex].lastMessage =
              text !== "" ? text : "Photo sent.";
            userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
            userChatsData.chats[chatIndex].receiverId = chatPartnerId;
            userChatsData.chats[chatIndex].updatedAt = Date.now();
      
            await updateDoc(userChatsRef, {
              chats: userChatsData.chats,
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setImg({
        file: null,
        url: "",
      });
      setText("");
      setIsSending(false);
    }
  };

  useEffect(() => {
    const updateCurrentlyTyping = async () => {
      const chatRef = doc(db, "chats", chatId);
      const chatSnapshot = await getDoc(chatRef);
  
      if (!chatSnapshot.exists()) return;
  
      const chatData = chatSnapshot.data();
      const currentlyTyping = chatData.currentlyTyping || [];
  
      const shouldBeTyping = text.length > 0 || img.url;
  
      if (shouldBeTyping && !currentlyTyping.includes(currentUser.id)) {
        await updateDoc(chatRef, {
          currentlyTyping: arrayUnion(currentUser.id),
        });
      } else if (!shouldBeTyping && currentlyTyping.includes(currentUser.id)) {
        await updateDoc(chatRef, {
          currentlyTyping: arrayRemove(currentUser.id),
        });
      }
    };
  
    updateCurrentlyTyping();
  }, [text, img?.url, chatId, currentUser.id]);
  


  return (
    <form className="mt-auto">
      <div className="px-2 pb-2 pt-1 flex flex-col w-full items-center border-t dark:border-gray-500">
        <div className="bg-gray-100 dark:text-gray-100 dark:bg-gray-700 w-full rounded-xl">
          {img.url && (
            <div className="relative w-fit px-4 py-2">
              <img src={img.url} alt="" className="h-40" />
              <span
                className="absolute top-3 right-5 opacity-50 bg-gray-50 rounded-full px-2 cursor-pointer hover:opacity-70 dark:text-black"
                onClick={handleRemoveImage}
              >
                x
              </span>
            </div>
          )}

          <div className="relative flex flex-col flex-1 mr-2 w-full">
            <textarea
              value={text}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              ref={textareaRef}
              placeholder="Send a message"
              className="block max-h-[60vh] w-full resize-none border-0 outline-none px-4 pt-2 pb-1 rounded-xl bg-gray-100 dark:text-gray-100 dark:bg-gray-700 overflow-y-auto dark-scrollbar always-scrollbar"
            ></textarea>
          </div>

          <div className="bg-gray-100 flex justify-between px-4 w-full rounded-xl dark:bg-gray-700 ">
            <div className="flex gap-2">
              <input
                type="file"
                id="img"
                className="hidden"
                onChange={handleImage}
              />
              <label
                htmlFor="img"
                className="flex items-center cursor-pointer justify-center"
              >
                <span className="rounded-full text-[24px] text-blue-700 dark:text-gray-200">
                  <i className="bi bi-image"></i>
                </span>
              </label>

              <span
                className="relative flex items-center cursor-pointer text-xl"
                onClick={() => setShowPicker((prev) => !prev)}
              >
                <img src={emoji} alt="" className="w-6 h-6" />
                {showPicker && (
                  <div className="absolute bottom-[30px] m-auto">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </span>
            </div>

            {text || img.url ? (
              <button type="submit" className="text-xl" onClick={handleSend}>
                <i className="bi bi-send-fill text-blue-600 hover:text-blue-500"></i>
              </button>
            ) : (
              <span className="text-xl">
                <i className="bi bi-send-fill text-gray-400"></i>
              </span>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
