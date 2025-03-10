import { query, collection, orderBy, startAt, endAt, limit, getDocs, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase/config";
import { updateDocument } from "./generalService";
import { removeFriend } from "./friendsService";

export const getSearchResults = async (inputSearchBar) => {
  if (!inputSearchBar.trim()) {
    return [];
  }

  const q = query(
    collection(db, "users"),
    orderBy("username"),
    startAt(inputSearchBar),
    endAt(inputSearchBar + "\uf8ff"),
    limit(5)
  );

  try {
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      username: doc.data().username,
      avatar: doc.data().avatar,
    }));
    return results;
  } catch (err) {
    console.error("Error fetching search results:", err);
    return [];
  }
};

export const blockUserInChat = async(userId, blockedId) => {
  await updateDocument("users", userId, {
    chatBlockedUsers: arrayUnion(blockedId)
  });

  await updateDocument("users", blockedId, {
    chatBlockedBy: arrayUnion(userId)
  });
};

export const unblockUserInChat = async(userId, blockedId) => {
  await updateDocument("users", userId, {
    chatBlockedUsers: arrayRemove(blockedId)
  });

  await updateDocument("users", blockedId, {
    chatBlockedBy: arrayRemove(userId)
  });
};

export const blockUser = async(userId, blockedId) => {
  await updateDocument("users", userId, {
    chatBlockedUsers: arrayUnion(blockedId),
    blockedUsers: arrayUnion(blockedId)
  });

  await updateDocument("users", blockedId, {
    chatBlockedBy: arrayUnion(userId),
    blockedBy: arrayUnion(userId)
  });

  removeFriend(userId, blockedId);
}

export const unblockUser = async(userId, blockedId) => {
  await updateDocument("users", userId, {
    blockedUsers: arrayRemove(blockedId)
  });

  await updateDocument("users", blockedId, {
    blockedBy: arrayRemove(userId)
  });
}
