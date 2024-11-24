import { authReducer } from "./authReducer";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  authState: authReducer,
})

export default allReducers;