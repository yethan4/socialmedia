import { query, collection, orderBy, startAt, endAt, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

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
