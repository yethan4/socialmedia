import { useState } from "react";
import { Link } from "react-router-dom"

import { toast } from "react-toastify";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/authAction";

export const Register = () => {
  const currentUser = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  console.log(currentUser)
  console.log(auth.currentUser)

  const [formData, setFromData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (e) => {
    setFromData({ ...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    const username = formData.username;
    const email = formData.email;
    const password = formData.password;
    const repeatPassword = formData.repeatPassword;

    //VALIDATE INPUTS
    if(!email || !username || !password || !repeatPassword) return;

    //VALIDATE UNIQUE USERNAME
    const usersRef = collection(db, "users");
    const qName = query(usersRef, where("username", "==", username));
    const queryNameSnapshot = await getDocs(qName);
    if (!queryNameSnapshot.empty){
      return toast.warn("Select another username")
    }
    
    //VALIDATE UNIQUE EMAIL
    const qEmail = query(usersRef, where("email", "==", email));
    const queryEmailSnapshot = await getDocs(qEmail);
    if (!queryEmailSnapshot.empty){
      return toast.warn("Select another email")
    }


    try{
      const res = await createUserWithEmailAndPassword(auth, email, password)

      const newUserData = {
        username,
        email,
        avatar: "https://firebasestorage.googleapis.com/v0/b/positx-ca63d.appspot.com/o/default%2FdefaultAvatar.png?alt=media&token=ee889b87-bcf3-4d04-9c4c-4746570793d9",
        id: res.user.uid,
        friends: [],
      }

      await setDoc(doc(db, "users", res.user.uid), newUserData)

      dispatch(login(newUserData));

      toast.success("Account created! You are now logged in.");
    } catch(err){
      toast.error(err.message);
    }
    
  }

  return (
    <form onSubmit={handleSubmit} className="w-full h-screen dark:bg-gray-800 pt-24">
      <div className="relative mx-auto max-w-[400px] sm:shadow-lg h-[560px] flex flex-col px-6 dark:text-white md:dark:shadow-lg md:dark:shadow-gray-900">
        <span className="mx-auto text-2xl font-medium mt-6 mb-6">Register</span>
        <label htmlFor="username" className="text-lg">Username</label>
        <div className="relative">
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="border-b w-full pl-8 py-3 outline-none dark:bg-gray-800"
          />
          <i className="bi bi-person-circle absolute left-1 top-3 text-gray-400"></i>
        </div>

        <label htmlFor="email" className="mt-2 text-lg">Email</label>
        <div className="relative">
          <input
            type="text"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border-b w-full pl-8 py-3 outline-none dark:bg-gray-800"
          />
          <i className="bi bi-envelope-fill absolute left-1 top-3 text-gray-400"></i>
        </div>

        <label htmlFor="password" className="mt-2 text-lg">Password</label>
        <div className="relative">
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="border-b w-full pl-8 py-3 outline-none dark:bg-gray-800"
          />
          <i className="bi bi-key-fill absolute left-1 top-3 text-gray-400"></i>
        </div>

        <label htmlFor="repeatPassword" className="mt-2 text-lg">Repeat Password</label>
        <div className="relative">
          <input
            type="password"
            id="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            placeholder="Repeat Password"
            className="border-b w-full pl-8 py-3 outline-none dark:bg-gray-800"
          />
          <i className="bi bi-key-fill absolute left-1 top-3 text-gray-400"></i>
        </div>
        <button type="submit" className="py-2 bg-blue-600 text-slate-100 mt-4 text-lg">Sign Up</button>
        <Link to="/login" className="hover:underline bottom-4 absolute text-sm">Already have an account?</Link>
      </div>
    </form>
  )
}
