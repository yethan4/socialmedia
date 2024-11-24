import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.authState.userInfo); // Upewnij się, że poprawna ścieżka stanu

  return userInfo ? <Navigate to="/" /> : children;
};