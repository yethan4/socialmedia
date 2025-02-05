import { authReducer } from "./authReducer";
import { combineReducers } from "redux";
import { postsReducer } from "./postsReducer";
import { notificationsReducer } from "./notificationsReducer";
import { chatsReducer } from "./chatsReducer";

const allReducers = combineReducers({
  authState: authReducer,
  postsState: postsReducer,
  notificationsState: notificationsReducer,
  chatsState: chatsReducer
})

export default allReducers;