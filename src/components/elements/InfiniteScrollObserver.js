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

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    !hasMore ? null : (
      <div ref={observerRef} className="h-20 flex justify-center mb-10">
        {loading && <img src={loadingGif} alt="loading gif" className="h-8" />}
      </div>
    )
  );
};
