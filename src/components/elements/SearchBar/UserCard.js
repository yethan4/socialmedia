import { useNavigate } from "react-router-dom";

export const UserCard = ({ user, setInputSearchBar, setIsSearching }) => {
  const navigate = useNavigate();

  const handleClick = (userId) => {
    setInputSearchBar(""); 
    if (setIsSearching) {
      setIsSearching(false);  
    }
    navigate(`/profile/${userId}`);  
  };

  return (
    <div
      className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
      onClick={() => handleClick(user.id)}
    >
      <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
      <span className="ml-4 font-semibold text-lg">{user.username}</span>
    </div>
  );
};
