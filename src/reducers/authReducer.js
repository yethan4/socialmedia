import { auth } from "../firebase/config";

const initialState = {
  currentUser: auth.currentUser || null,
};

export const authReducer = (state = initialState, action) => {
  switch(action.type){
    case "LOGIN":
      return{
        ...state,
        currentUser: action.payload,
      };
    case "LOGOUT":
      return{
        ...state,
        currentUser: null,
      };
    case "UPDATE":
      return{
        ...state,
        currentUser: action.payload,
      };
    default:
      return state;
  }
};