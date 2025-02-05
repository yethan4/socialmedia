const initialState = {
  chats: [],
  loading: true,
  currentChat: null,
}

export const chatsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CHATS":
      return{
        ...state,
        chats: action.payload.chats,
        loading: false,
      };
    case "SET_LOADING":
      return{
        ...state,
        loading: action.payload,
      };
    case "SET_CURRENT_CHAT":
      return{
        ...state,
        currentChat: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}