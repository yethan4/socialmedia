import { useEffect, useRef } from "react";

import loadingGif from "../../assets/loading.gif";

export const InfiniteScrollObserver = ({ loadMore, loading, hasMore }) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = observerRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    hasMore && (
      <div ref={observerRef} className="h-20 flex justify-center mb-10">
        {loading && <img src={loadingGif} alt="loading gif" className="h-8" />}
      </div>
    )
  );
};
