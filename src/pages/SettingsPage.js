import { useRef, useState } from "react";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword} from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebase/config";
import { Link } from "react-router-dom";
import { isUsernameTaken } from "../services/authService";
import { updateDocument } from "../services/generalService";

export const SettingsPage = () => {
  const [choice, setChoice] = useState("");
  const user = auth.currentUser;

  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const repeatPasswordRef = useRef();
  const usernameRef = useRef();

  const changePassword = async () => {
    const currentPassword = currentPasswordRef.current.value;
    const password = newPasswordRef.current.value;
    const repeatPassword = repeatPasswordRef.current.value;

    if (!currentPassword || !password || !repeatPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (currentPassword === password){
      toast.error("The new password must be different from the current password.")
      return;
    }

    if (password !== repeatPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    if (password.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, password);
      toast.success("Password updated successfully.");
      currentPasswordRef.current.value = "";
      newPasswordRef.current.value = "";
      repeatPasswordRef.current.value = "";
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential") {
        toast.error("Invalid current password provided.");
      } else {
        toast.error("Error updating password. Please try again.");
      }
    }
  };

  const changeUsername = async () => {
    const newUsername = usernameRef.current.value;

    if (!newUsername.trim()) {
      toast.error("Username cannot be empty.");
      return;
    }

    try {
      const result = await isUsernameTaken(newUsername)
      if (result){
        return toast.warn("Select another username")
      }

      await updateDocument("users", user.uid, {username: newUsername});

      toast.success("Username updated successfully.");
      usernameRef.current.value = "";
    } catch (err) {
      console.error(err);
      toast.error("Error updating username: " + err.message);
    }
  };

  const InputField = ({ type, placeholder, inputRef }) => (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full pl-8 py-2 text-md text-gray-700 shadow rounded-xl outline-none focus:ring-2 ring-gray-200 dark:bg-gray-800 dark:text-slate-100 dark:ring-gray-700"
      ref={inputRef}
    />
  );

  return (
    <>
      <div className="bg-gray-0 px-14 max-sm:px-2 h-full flex-1 w-full sm:min-w-[480px] max-w-[1024px] mx-auto">
        <div className="flex flex-col border-b w-full pb-4">
          {/* Change Password Section */}
          <div
            className="flex items-center w-full hover:bg-gray-50 px-10 py-2 rounded-xl select-none cursor-pointer dark:bg-gray-900 dark:text-slate-50 dark:hover:bg-gray-800"
            onClick={choice === "changePassword" ? () => setChoice("") : () => setChoice("changePassword")}
          >
            <span className="text-xl pb-1 mb-1 mr-2 px-2 pt-1 bg-amber-400 text-white rounded-full dark:bg-amber-500">
              <i className="bi bi-key"></i>
            </span>
            <span className="text-2xl mb-1">Change password</span>
            {choice === "changePassword" ? (
              <span>
                <i className="bi bi-arrow-up-short ml-1 px-2 py-1 rounded-full"></i>
              </span>
            ) : (
              <span>
                <i className="bi bi-arrow-down-short ml-1 px-2 py-1 rounded-full"></i>
              </span>
            )}
          </div>
          {choice === "changePassword" && (
            <div className="mt-4 flex items-center flex-col gap-4">
              <InputField type="password" placeholder="Enter your current password" inputRef={currentPasswordRef} />
              <InputField type="password" placeholder="Enter new password" inputRef={newPasswordRef} />
              <InputField type="password" placeholder="Repeat new password" inputRef={repeatPasswordRef} />
              <div>
                <button
                  type="submit"
                  onClick={changePassword}
                  className="px-6 py-2 text-slate-50 bg-blue-600 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Change Username Section */}
        <div className="border-b pt-5 flex flex-col w-full pb-4">
          <div
            className="flex items-center w-full hover:bg-gray-50 px-10 py-2 rounded-xl select-none cursor-pointer dark:bg-gray-900 dark:text-slate-50 dark:hover:bg-gray-800"
            onClick={choice === "changeUsername" ? () => setChoice("") : () => setChoice("changeUsername")}
          >
            <span className="text-xl pb-1 mb-1 mr-2 px-2 pt-1 bg-gray-600 text-white rounded-full">
              <i className="bi bi-person"></i>
            </span>
            <span className="text-2xl mb-1">Change username</span>
            {choice === "changeUsername" ? (
              <span>
                <i className="bi bi-arrow-up-short ml-1 px-2 py-1 rounded-full"></i>
              </span>
            ) : (
              <span>
                <i className="bi bi-arrow-down-short ml-1 px-2 py-1 rounded-full"></i>
              </span>
            )}
          </div>
          {choice === "changeUsername" && (
            <div className="mt-4 flex items-center flex-col gap-4">
              <InputField type="text" placeholder="Enter your new username" inputRef={usernameRef} />
              <button
                type="submit"
                onClick={changeUsername}
                className="px-6 py-2 text-slate-50 bg-blue-600 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500"
              >
                Update Username
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="border-b pt-5 flex flex-col w-full pb-4">
          <Link to="/notifications">
            <div className="flex items-center w-full hover:bg-gray-50 px-10 py-2 rounded-xl select-none cursor-pointer dark:bg-gray-900 dark:text-slate-50 dark:hover:bg-gray-800">
              <span className="text-xl pb-1 mb-1 mr-2 px-2 pt-1 bg-red-500 text-white rounded-full dark:bg-red-600">
                <i className="bi bi-bell"></i>
              </span>
              <span className="text-2xl mb-1">All notifications</span>
              <i className="bi bi-arrow-up-right ml-2"></i>
            </div>
          </Link>
        </div>

        {/* Bookmarks */}
        <div className="border-b pt-5 flex flex-col w-full pb-4">
          <Link to="/bookmarks">
            <div className="flex items-center w-full hover:bg-gray-50 px-10 py-2 rounded-xl select-none cursor-pointer dark:bg-gray-900 dark:text-slate-50 dark:hover:bg-gray-800">
              <span className="text-xl pb-1 mb-1 mr-2 px-2 pt-1 bg-blue-500 text-white rounded-full dark:bg-blue-600">
                <i className="bi bi-bookmark"></i>
              </span>
              <span className="text-2xl mb-1">Bookmarks</span>
              <i className="bi bi-arrow-up-right ml-2"></i>
            </div>
          </Link>
        </div>

        {/* Activity */}
        <div className="border-b pt-5 flex flex-col w-full pb-4">
          <Link to="/my-activity">
            <div className="flex items-center w-full hover:bg-gray-50 px-10 py-2 rounded-xl select-none cursor-pointer dark:bg-gray-900 dark:text-slate-50 dark:hover:bg-gray-800">
              <span className="text-xl pb-1 mb-1 mr-2 px-2 pt-1 bg-green-500 text-white rounded-full dark:bg-green-600">
                <i className="bi bi-activity"></i>
              </span>
              <span className="text-2xl mb-1">Activity</span>
              <i className="bi bi-arrow-up-right ml-2"></i>
            </div>
          </Link>
        </div>

      </div>
    </>
  );
};
