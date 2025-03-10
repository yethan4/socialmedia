const initialState = {
  users: {},
  loading: false,
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.id]: action.payload,
        },
      };
    case "SET_USERS":
      return {
        ...state,
        users: { ...state.users, ...action.payload },
      };
    default:
      return state;
  }
};
