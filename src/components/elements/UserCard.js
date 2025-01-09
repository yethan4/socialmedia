import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDocument } from '../../services/fetchDocument';

export const UserCard = ({userId}) => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchDocument(userId, "users").then((user) => setUserData(user))
  }, [userId])

  return (
    <Link to={`/profile/${userId}`}>
    <div className="flex items-center px-2 py-1 hover:bg-gray-200 cursor-pointer rounded-xl dark:hover:bg-gray-700">
      <img src={userData?.avatar} alt="" className="w-10 h-10 object-cover rounded-full" />
      <span className="ml-2">{userData?.username}</span>
    </div>
    </Link>
  )
}
