import { fetchDocument } from "../services/oneDocumentService";

export const setUser = (user) => ({
  type: "SET_USER",
  payload: user,
});

export const setUsers = (users) => ({
  type: "SET_USERS",
  payload: users,
});

// Funkcja do pobrania użytkownika, jeśli go jeszcze nie ma w store
export const fetchUserIfNeeded = (userId) => {
  return async (dispatch, getState) => {
    const { users } = getState().usersState;
    if (!users[userId]) {
      const user = await fetchDocument(userId, "users");
      dispatch(setUser(user));
    }
  };
};
