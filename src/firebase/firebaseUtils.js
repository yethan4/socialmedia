import { auth } from "./config";

export const initializeAuth = (dispatch) => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      dispatch({
        type: "LOGIN",
        payload: user,
      });
    } else {
      dispatch({
        type: "LOGOUT",
        payload: null,
      });
    }
  });
};
