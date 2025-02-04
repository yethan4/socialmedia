import { useState, useEffect } from "react";
import { collection, query, orderBy, startAt, endAt, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
const useSearchUsers = (inputSearchBar) => {
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!inputSearchBar.trim()) {
        setSearchResult([]);
        return;
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
        setSearchResult(results);
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    };

    fetchData();
  }, [inputSearchBar]);

  return searchResult;
};

export default useSearchUsers;
