import { collection, endAt, getDocs, limit, orderBy, query, startAt } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase/config";
import { UserCard } from "./UserCard";

export const SearchBarSm = ({inputSearchBar, setInputSearchBar}) => {
  const [isSearching, setIsSearching] = useState(false);
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
    <div className="flex flex-col mt-1">
      <span onClick={() => setIsSearching(!isSearching)}>
        <i className="bi bi-search ml-1 rounded-full pt-1 px-2 text-xl cursor-pointer hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"></i>
      </span>
      {isSearching && (
        <div className="fixed top-[62px] left-0 right-0 pt-1 flex flex-col items-center bg-white dark:bg-gray-800">
          <input
            name="search"
            type="text"
            className="w-11/12 px-2 py-3 outline-none bg-gray-50 rounded dark:bg-gray-700"
            placeholder="Search"
            autoComplete="off"
            value={inputSearchBar}
            onChange={(e) => setInputSearchBar(e.target.value)}
          />
          <div className="flex flex-col w-full mt-2 pb-4">
            {searchResult.length > 0 && (
              searchResult.map((user) => (
                <UserCard key={user.id} user={user} setInputSearchBar={setInputSearchBar} setSearchResult={setSearchResult} setIsSearching={setIsSearching}/>
              ))
            )}
            {searchResult.length == 0 && inputSearchBar && (
              <p className="px-4 py-2 text-gray-500">No results found.</p>
            )}
          </div>
        </div>
      )}

      {/* {isSearching && (
        <inputSearchBar
          name="search"
          type="text"
          className="absolute w-64 pl-8 py-2 text-md text-gray-700 shadow rounded-xl outline-none focus:ring-2 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
          placeholder="Search"
          autoComplete="off"
          onChange={(e) => setinputSearchBar(e.target.value)}
        />
      )}
      {inputSearchBar && (
        <div className="absolute top-[50px] right-0 max-h-96 w-96 pt-2 flex flex-col gap-1 bg-white shadow rounded overflow-y-auto">
          {searchResult.length > 0 ? (
            searchResult.map((user) => (
              <div
                key={user.id}
                className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-50"
                onClick={() => handleClick(user.id)}
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="ml-4 font-semibold text-lg">
                  {user.username}
                </span>
              </div>
            ))
          ) : (
            <p className="px-4 py-2 text-gray-500">No results found.</p>
          )}
        </div>
      )} */}
    </div>
  );
};
