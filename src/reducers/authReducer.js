const initialState = {
  userInfo: null,
  loading: true,
};

export const authReducer = (state = initialState, action) => {
  switch(action.type){
    case "LOGIN":
      return{
        ...state,
        userInfo: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return{
        ...state,
        userInfo: null,
        loading: false,
      };
    case "UPDATE":
      return{
        ...state,
        userInfo: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};