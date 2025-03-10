import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { isEmailTaken, isUsernameTaken, registerUser } from "../services/authService";

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, repeatPassword } = formData;

    // VALIDATE INPUTS
    if (!username || !email || !password || !repeatPassword) {
      return toast.warn("Please fill in all fields.");
    }

    if (!validateEmail(email)) {
      return toast.warn("Invalid email format.");
    }

    if (!validatePassword(password)) {
      return toast.warn("Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.");
    }

    if (password !== repeatPassword) {
      return toast.warn("Passwords do not match.");
    }

    const [usernameTaken, emailTaken] = await Promise.all([
      isUsernameTaken(username),
      isEmailTaken(email),
    ]);
  
    if (usernameTaken) {
      console.log("This username is already taken.");
    }
  
    if (emailTaken) {
      console.log("This email is already registered.");
    }

    await registerUser(username, email, password);
  };

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
            required
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
            required
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
            required
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
            required
            className="border-b w-full pl-8 py-3 outline-none dark:bg-gray-800"
          />
          <i className="bi bi-key-fill absolute left-1 top-3 text-gray-400"></i>
        </div>

        <button type="submit" className="py-2 bg-blue-600 text-slate-100 mt-4 text-lg">Sign Up</button>
        <Link to="/login" className="hover:underline bottom-4 absolute text-sm">Already have an account?</Link>
      </div>
    </form>
  );
};
