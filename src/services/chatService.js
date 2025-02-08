import { addDoc, arrayUnion, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const createNewChat = async (currentUserId, userId) => {
  try {
    const currentUserChatsRef = doc(db, "userchats", currentUserId);
    const userChatsRef = doc(db, "userchats", userId)
    const currentUserChatsSnap = await getDoc(currentUserChatsRef);

    const currentUserChatsData = currentUserChatsSnap.data();
    const chatExists = currentUserChatsData?.chats?.some(chat => chat.withUserId === userId)

    if (!chatExists){
      const date = Date.now()
      const chatRef = await addDoc(collection(db, "chats"), {
        createdAt: serverTimestamp(),
        messages: [],
        currentlyTyping: [],
        seenBy: []
      });
      await updateDoc(currentUserChatsRef, {
        chats: arrayUnion({
          chatId: chatRef.id,
          isSeen: false,
          lastMessage: "You can now chat!",
          receiverId: "",
          updatedAt: date,
          withUserId: userId
        })
      })
      await updateDoc(userChatsRef, {
        chats: arrayUnion({
          chatId: chatRef.id,
          isSeen: false,
          lastMessage: "You can now chat!",
          receiverId: "",
          updatedAt: date,
          withUserId: currentUserId
        })
      })
    }
  } catch (error) {
    console.error(error);
  }
};

