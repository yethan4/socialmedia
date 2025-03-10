export const setNotifications = (notifications) => {
  return{
    type: "SET_NOTIFICATIONS",
    payload: {
      notifications
    }
  };
};