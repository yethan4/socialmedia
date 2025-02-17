import { addDoc, arrayUnion, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { uploadImage } from "./imageService";

export const createNewChat = async (currentUserId, userId) => {
  try {
    const currentUserChatsRef = doc(db, "userchats", currentUserId);
    const userChatsRef = doc(db, "userchats", userId)
    const currentUserChatsSnap = await getDoc(currentUserChatsRef);

    const currentUserChatsData = currentUserChatsSnap.data();
    const existingChat = currentUserChatsData?.chats?.find(chat => chat.withUserId === userId);

    if (!existingChat ){
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
    } else if(existingChat ){
      const date = Date.now()
      const updatedChats = currentUserChatsData.chats.map(chat =>
        chat.chatId === existingChat.chatId ? { 
          ...chat, 
          isDeleted: false,
          isSeen: false,
          lastMessage: "You can now chat!",
          receiverId: "",
          updatedAt: date,
        } : chat
      );

      await updateDoc(currentUserChatsRef, { chats: updatedChats });
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteChat = async(chat, userId) => {
  const chatRef = doc(db, "chats", chat.chatId);
  const userChatRef = doc(db, "userchats", userId);

  const chatSnap = await getDoc(chatRef);
  const userChatSnap = await getDoc(userChatRef);

  if (!chatSnap.exists() || !userChatSnap.exists()) return;

  const chatData = chatSnap.data();
  const userChats = userChatSnap.data().chats || [];

  const updatedChats = userChats.map(singleChat => 
    singleChat.chatId === chat.chatId ? { ...singleChat, isDeleted: true } : singleChat
  );

  const currentTime = Date.now() / 1000;
  const lastClearedOther = chatData.lastClearedAt?.[chat.withUserId] || 0;

  if (lastClearedOther) {
    const filteredMessages = chatData.messages.filter(msg => msg.createdAt.seconds > lastClearedOther);

    await updateDoc(chatRef, {
      messages: filteredMessages,
      [`lastClearedAt.${userId}`]: currentTime
    });
  } else {
    await updateDoc(chatRef, {
      [`lastClearedAt.${userId}`]: currentTime
    });
  }

  await updateDoc(userChatRef, { chats: updatedChats });
}

export const sendMessage = async ({ chatId, currentUser, chatPartnerId, text, imgFile }) => {
  if (!chatId || (!text && !imgFile)) return;

  let imgUrl = null;

  try {
    if (imgFile) {
      imgUrl = await uploadImage(imgFile);
    }

    await updateDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        senderId: currentUser.id,
        text,
        createdAt: new Date(),
        ...(imgUrl && { img: imgUrl }),
      }),
      seenBy: [currentUser.id],
    });

    const userIDs = [currentUser.id, chatPartnerId];

    for (const id of userIDs) {
      const userChatsRef = doc(db, "userchats", id);
      const userChatsSnapshot = await getDoc(userChatsRef);

      if (userChatsSnapshot.exists()) {
        const userChatsData = userChatsSnapshot.data();
        const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);

        if (chatIndex !== -1) {
          userChatsData.chats[chatIndex].lastMessage = text !== "" ? text : "Photo sent.";
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
          userChatsData.chats[chatIndex].receiverId = chatPartnerId;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          if (userChatsData.chats[chatIndex].isDeleted) {
            userChatsData.chats[chatIndex].isDeleted = false;
          }

          await updateDoc(userChatsRef, { chats: userChatsData.chats });
        }
      }
    }
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
};
