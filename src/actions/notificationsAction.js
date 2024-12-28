export const setNotifications = (notifications) => {
  return{
    type: "SET_NOTIFICATIONS",
    payload: {
      notifications
    }
  };
};

export const deleteNotification = (id) => {
  return{
    type: "DELETE_NOTIFICATION",
    payload: id,
  };
};