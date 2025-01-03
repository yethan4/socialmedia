import { collection, endAt, getDocs, limit, orderBy, query, startAt } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase/config";
import { UserCard } from "./UserCard";

export const SearchBar = ({inputSearchBar, setInputSearchBar}) => {
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

  return (
    <div className="relative flex flex-col">
      <i className="bi bi-search absolute top-2 left-2 text-gray-400"></i>
      <input
        name="search"
        type="text"
        className="w-64 pl-8 py-2 text-md text-gray-700 shadow rounded-xl outline-none focus:ring-2 ring-gray-200 dark:bg-gray-800 dark:text-slate-100 dark:ring-gray-700"
        placeholder="Search"
        autoComplete="off"
        value={inputSearchBar}
        onChange={(e) => setInputSearchBar(e.target.value)}
      />
      {inputSearchBar && (
        <div className="absolute top-[50px] right-0 max-h-96 w-96 py-2 flex flex-col gap-1 bg-white shadow rounded overflow-y-auto dark:bg-gray-800 dark:border-b dark:border-r dark:border-gray-700">
          {searchResult.length > 0 ? (
            searchResult.map((user) => (
              <UserCard key={user.id} user={user} setInputSearchBar={setInputSearchBar} setSearchResult={setSearchResult}/>
            ))
          ) : (
            <p className="px-4 py-2 text-gray-500">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};
