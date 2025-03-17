import { useState } from "react";
import { SearchUserCard } from "./SearchUserCard";
import useSearchUsers from "../../../hooks/useSearchUsers";

export const SearchBarSm = ({inputSearchBar, setInputSearchBar}) => {
  const [isSearching, setIsSearching] = useState(false);
 
  const searchResult = useSearchUsers(inputSearchBar); 

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
                <SearchUserCard key={user.id} user={user} setInputSearchBar={setInputSearchBar} setIsSearching={setIsSearching}/>
              ))
            )}
            {searchResult.length === 0 && inputSearchBar && (
              <p className="px-4 py-2 text-gray-500">No results found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
