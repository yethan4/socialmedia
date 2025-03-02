import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify";
import { createNewChat } from "./chatService";

const checkFriendRequestId = async (currentUserId, userId) => {
  try{
    const sentRequests = query(
      collection(db, "friendRequests"),
      where("status", "==", "pending"),
      where("fromUserId", "==", currentUserId),
      where("toUserId", "==", userId)
    );
    const receivedRequests = query(
      collection(db, "friendRequests"),
      where("status", "==", "pending"),
      where("fromUserId", "==", userId),
      where("toUserId", "==", currentUserId)
    );

    const sentSnapshot = await getDocs(sentRequests);
    const receivedSnapshot = await getDocs(receivedRequests);

    if (!sentSnapshot.empty) {
      return sentSnapshot.docs[0].id;
    } else if (!receivedSnapshot.empty) {
      return receivedSnapshot.docs[0].id;
    } else{
      return "";
    }
  }catch(err){
    console.log(err);
  }
}

export const sentFriendRequest = async(currentUserId, userId) => {
  try {
    await addDoc(collection(db, "notifications"), {
      fromUserId: currentUserId,
      toUserId: userId,
      timestamp: serverTimestamp(),
      seen: false,
      type: "friendRequest",
    });

    await addDoc(collection(db, "friendRequests"), {
      fromUserId: currentUserId,
      toUserId: userId,
      status: "pending",
      sendTime: serverTimestamp(),
    });

    toast.success("Friend request has been sent.")
  } catch (err) {
    console.log(err);
  }
}

export const addFriend = async(currentUserId, userId, friendRequestId="") => {
  try{
    const currentUserDocRef = doc(db, "users", currentUserId);
    const userDocRef = doc(db, "users", userId);
    if(!friendRequestId){
      friendRequestId = await checkFriendRequestId(currentUserId, userId);
    }
    const friendRequestRef = doc(db, "friendRequests", friendRequestId);
    const notificationsRef = collection(db, "notifications");

    const q = query(notificationsRef,
      where("fromUserId", "==", userId),
      where("toUserId", "==", currentUserId),
      where("type", "==", "friendRequest"),
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty){
      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
        try{
          await updateDoc(docRef, {
            type: "friends"
          })
        }catch(err){
          console.log(err)
        }
      })
    }

    await updateDoc(currentUserDocRef, {
      friends: arrayUnion(userId),
    });

    await updateDoc(userDocRef, {
      friends: arrayUnion(currentUserId),
    });

    await updateDoc(friendRequestRef, {
      status: "accepted"
    });

    await addDoc(collection(db, "notifications"), {
      fromUserId: currentUserId,
      toUserId: userId,
      timestamp: serverTimestamp(),
      seen: false,
      type: "friends",
    })
    
    //create a new chat between users if it doesn't exist
    await createNewChat()
    

    toast.success("You are friends now!");

  }catch(err){
    console.log(err);
  }
}

export const removeFriend = async(currentUserId, userId) => {
  try{
    const currentUserDocRef = doc(db, "users", currentUserId);
    const userDocRef = doc(db, "users", userId);
    
    await updateDoc(currentUserDocRef, {
      friends: arrayRemove(userId),
    });

    await updateDoc(userDocRef, {
      friends: arrayRemove(currentUserId),
    });

  }catch(err){
    console.log(err)
  }
}

export const rejectFriendRequest = async(currentUserId, userId, friendRequestId="") => {
  try{
    if(!friendRequestId){
      friendRequestId = await checkFriendRequestId(currentUserId, userId);
    }
    const friendRequestRef = doc(db, "friendRequests", friendRequestId);
    const notificationsRef = collection(db, "notifications");

    const q = query(notificationsRef,
      where("fromUserId", "==", userId),
      where("toUserId", "==", currentUserId),
      where("type", "==", "friendRequest"),
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty){
      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
        try{
          await deleteDoc(docRef);
        }catch(err){
          console.log(err)
        }
      })
    }

    await updateDoc(friendRequestRef, {
      status: "rejected",
      responseTime: serverTimestamp()
    });

    toast.info("The request was rejected.")
  }catch(err){
    console.log(err)
  }
}

export const undoFriendRequest = async(currentUserId, userId, friendRequestId="") => {
  try{
    if(!friendRequestId){
      friendRequestId = await checkFriendRequestId(currentUserId, userId);
    }
    const friendRequestRef = doc(db, "friendRequests", friendRequestId);
    const notificationsRef = collection(db, "notifications");

    const q = query(notificationsRef,
      where("fromUserId", "==", currentUserId),
      where("toUserId", "==", userId),
      where("type", "==", "friendRequest"),
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty){
      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
        try{
          await deleteDoc(docRef);
        }catch(err){
          console.log(err)
        }
      })
    }

    await updateDoc(friendRequestRef, {
      status: "revoked",
      responseTime: serverTimestamp()
    });

    toast.info("Your request has been withdrawn.")

  }catch(err){
    console.log(err)
  }
}

export const checkFriendStatus = async(currentUser, userId) => {
  if(currentUser.id === userId) {
    return {
      status: "",
      requestId: "",
    }
  } else if (currentUser.friends.includes(userId)) {
    return {
      status: "friends",
      requestId: "",
    };
  } else {
    try {
      const sentRequests = query(
        collection(db, "friendRequests"),
        where("status", "==", "pending"),
        where("fromUserId", "==", currentUser.id),
        where("toUserId", "==", userId)
      );
      const receivedRequests = query(
        collection(db, "friendRequests"),
        where("status", "==", "pending"),
        where("fromUserId", "==", userId),
        where("toUserId", "==", currentUser.id)
      );

      const sentSnapshot = await getDocs(sentRequests);
      const receivedSnapshot = await getDocs(receivedRequests);

      if (!sentSnapshot.empty) {
        const docS = sentSnapshot.docs[0];
        return {
          status: "pendingSent",
          requestId: docS.id,
        };
      } else if (!receivedSnapshot.empty) {
        const docR = receivedSnapshot.docs[0];
        return {
          status: "pendingReceived",
          requestId: docR.id,
        };
      } else {
        return {
          status: "strangers",
          requestId: "",
        };
      }
    } catch (e) {
      console.log(e);
    }
  }
}