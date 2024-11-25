import { authReducer } from "./authReducer";
import { combineReducers } from "redux";
import { postsReducer } from "./postsReducer";

const allReducers = combineReducers({
  authState: authReducer,
  postsState: postsReducer
})

export default allReducers;