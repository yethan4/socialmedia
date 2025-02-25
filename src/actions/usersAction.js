import { fetchDocument } from "../services/generalService";

export const setUser = (user) => ({
  type: "SET_USER",
  payload: user,
});

export const setUsers = (users) => ({
  type: "SET_USERS",
  payload: users,
});

export const fetchUserIfNeeded = (userId) => {
  return async (dispatch, getState) => {
    const { users } = getState().usersState;
    if (!users[userId]) {
      const user = await fetchDocument(userId, "users");
      dispatch(setUser(user));
    }
  };
};
