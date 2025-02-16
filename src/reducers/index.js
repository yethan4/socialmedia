import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { postsReducer } from "./postsReducer";
import { notificationsReducer } from "./notificationsReducer";
import { chatsReducer } from "./chatsReducer";
import { usersReducer } from "./usersReducer";

const allReducers = combineReducers({
  authState: authReducer,
  postsState: postsReducer,
  notificationsState: notificationsReducer,
  chatsState: chatsReducer,
  usersState: usersReducer,
});

export default allReducers;