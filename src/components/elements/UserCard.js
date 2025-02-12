import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDocument } from '../../services/oneDocumentService';
import { AvatarImage } from './AvatarImage';

export const UserCard = ({userId}) => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchDocument(userId, "users").then((user) => setUserData(user))
  }, [userId])

  return (
    <Link to={`/profile/${userId}`}>
    <div className="flex items-center px-2 py-1 hover:bg-gray-200 cursor-pointer rounded-xl dark:hover:bg-gray-700">
      <AvatarImage src={userData?.avatar} size={10} />
      <span className="ml-2">{userData?.username}</span>
    </div>
    </Link>
  )
}
