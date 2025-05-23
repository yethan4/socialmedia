import { createUserWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, database, db } from "../firebase/config";
import { logout } from "../actions/authAction";
import { collection, doc, getDoc, getDocs, limit, onSnapshot, query, setDoc, where} from "firebase/firestore";
import { ref, onValue, onDisconnect, set} from "firebase/database";
import { setPosts } from "../actions/postsAction";

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
          monitorUserPresence(user.uid);
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
    toast.error("Invalid email or password")
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
      bookmarks: [],
    };

    const userDetails = {
      aboutMe: "",
      bgImg: ""
    };

    await setDoc(doc(db, "users", res.user.uid), newUserData)
    await setDoc(doc(db, "userDetails", res.user.uid), userDetails);
    await setDoc(doc(db, "userchats", res.user.uid), {
      chats: [],
    });
    toast.success("Account created! You are now logged in.");
  } catch(err){
    toast.error(err.message);
  }
}

export const signOutUser = async (dispatch) => {
  try {
    await firebaseSignOut(auth);

    dispatch(logout());
    dispatch(setPosts([], null));

    toast.success("You are logged out.");
  } catch (err) {
    toast.error(err.message);
  }
};

export const resetPassword = async(email) => {
  try{
    await sendPasswordResetEmail(auth, email);
    toast.success("The link has been sent. Please check your email.");
  }catch(err){
    console.log(err)
  }
};

//monitor user presence
export const monitorUserPresence = (userId) => {
  const amOnlineRef = ref(database, ".info/connected");
  const userRef = ref(database, `/presence/${userId}`); 

  onValue(amOnlineRef, (snapshot) => {
    if (snapshot.val() === true) {
      set(userRef, true)

      onDisconnect(userRef).set({
        online: false,
        lastActive: Date.now(),
      });
    }
  });
};

export const isUsernameTaken = async (username) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const isEmailTaken = async (email) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email), limit(1));

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};