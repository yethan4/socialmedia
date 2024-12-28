const initialState = {
  notifications: [],
  unreadCount: 0, 
};

export const notificationsReducer = (state = initialState, action) => {
  switch(action.type){
    case "SET_NOTIFICATIONS":
      return{
        ...state,
        notifications: action.payload.notifications,
        unreadCount: action.payload.notifications.length,
      };
    case "DELETE_NOTIFICATION":
      return{
        ...state,
        notifications: state.notifications.filter((notification) => notification.id !== action.payload)
      };
    default:
      return state;
  }
}