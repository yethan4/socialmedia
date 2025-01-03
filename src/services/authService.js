import { createUserWithEmailAndPassword, signOut as firebaseSignOut, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db } from "../firebase/config";
import { logout } from "../actions/authAction";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

export const watchUserDocument = (userId, dispatch) => {
  const docRef = doc(db, "users", userId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      dispatch({
        type: "UPDATE",
        payload: docSnap.data(),
      });
    } else {
      console.error("Document does not exist!");
    }
  });
};

export const initializeAuth = (dispatch) => {
  let unsubscribeUserDoc = null;

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          dispatch({
            type: "LOGIN",
            payload: docSnap.data(),
          });

          unsubscribeUserDoc = watchUserDocument(user.uid, dispatch);
        } else {
          throw new Error("No user document found.");
        }
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }

      dispatch({
        type: "LOGOUT",
        payload: null,
      });
    }
  });
};

export const signInUser = async(email, password) => {
  try{
    const res = await signInWithEmailAndPassword(auth, email, password)

    if (!res || !res.user) {
      throw new Error("Invalid response from Firebase.");
    }

    toast.success("You are now logged in.")
  }catch(err){
    toast.error(err.message)
  }
};

export const registerUser = async(username, email, password) => {
  try{
    const res = await createUserWithEmailAndPassword(auth, email, password)

    const newUserData = {
      username,
      email,
      avatar: "https://firebasestorage.googleapis.com/v0/b/positx-ca63d.appspot.com/o/default%2FdefaultAvatar.png?alt=media&token=ee889b87-bcf3-4d04-9c4c-4746570793d9",
      id: res.user.uid,
      friends: [],
    };

    const userDetails = {
      aboutMe: "",
      bgImg: ""
    };

    await setDoc(doc(db, "users", res.user.uid), newUserData)
    await setDoc(doc(db, "userDetails", res.user.uid), userDetails);
    toast.success("Account created! You are now logged in.");
  } catch(err){
    toast.error(err.message);
  }
}

export const signOutUser = async (dispatch) => {
  try {
    await firebaseSignOut(auth);

    dispatch(logout());

    toast.success("You are logged out.");
  } catch (err) {
    toast.error(err.message);
  }
};


