import { useEffect } from "react";

export const useTitle = (title="") => {

  useEffect(() => {
    document.title = `SocialApp ${title}`
  }, [title])

  return null;
}