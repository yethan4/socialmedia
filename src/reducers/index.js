import { authReducer } from "./authReducer";
import { combineReducers } from "redux";
import { postsReducer } from "./postsReducer";
import { notificationsReducer } from "./notificationsReducer";

const allReducers = combineReducers({
  authState: authReducer,
  postsState: postsReducer,
  notificationsState: notificationsReducer
})

export default allReducers;