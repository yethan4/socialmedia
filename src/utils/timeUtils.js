export const formatTimeAgo = (seconds) => {
  const now = Date.now();
  const date = new Date(seconds * 1000);
  const diff = Math.floor((now - date.getTime()) / 1000); // różnica w sekundach

  if (diff < 60) return "just a moment ago";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;

  return date.toLocaleDateString();
};

export const formatDisplayDate = (seconds) => {
  // Jeśli przekazany argument to liczba sekund, to konwertujemy ją do daty
  const date = new Date(seconds * 1000);

  if (isNaN(date.getTime())) {
    return null; // Jeśli data jest niepoprawna, zwrócimy null
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const secondsFormatted = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${day}.${month}.${year}, ${hours}:${minutes}`;

  return formattedDate;
};