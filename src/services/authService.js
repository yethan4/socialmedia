import { signOut as firebaseSignOut } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebase/config";
import { logout } from "../actions/authAction";

// Zmieniamy nazwę funkcji, żeby nie kolidowała z importowaną funkcją `signOut`
export const signOutUser = async (dispatch) => {
  try {
    await firebaseSignOut(auth);

    dispatch(logout());

    toast.success("You are logged out.");
  } catch (err) {
    toast.error(err.message);
  }
};
