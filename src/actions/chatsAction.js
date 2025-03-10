export const setLoading = (loading) => {
  return {
    type: "SET_LOADING",
    payload: loading,
  };
};

export const setChats = (chats) => {
  return {
    type: "SET_CHATS",
    payload: {
      chats,
    },
  };
};

export const setCurrentChat = (chat) => {
  return {
    type: "SET_CURRENT_CHAT",
    payload: chat,
  };
};