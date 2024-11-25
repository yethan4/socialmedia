export const formatTimestamp = (seconds) => {
  const now = Date.now();
  const date = new Date(seconds * 1000);
  const diff = Math.floor((now - date.getTime()) / 1000); // różnica w sekundach

  if (diff < 60) return "just a moment ago";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;

  return date.toLocaleDateString();
};
