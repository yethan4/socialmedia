import { useState, useEffect } from "react";
import { getSearchResults } from "../services/searchService";

const useSearchUsers = (inputSearchBar) => {
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!inputSearchBar.trim()) {
        setSearchResult([]);
        return;
      }

      const result = await getSearchResults(inputSearchBar)
      setSearchResult(result);
    };

    fetchData();
  }, [inputSearchBar]);

  return searchResult;
};

export default useSearchUsers;
