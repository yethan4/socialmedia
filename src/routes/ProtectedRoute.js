import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({children}) => {
  const userInfo = useSelector(state => state.authState.userInfo)

  return userInfo ? children : <Navigate to="/login" />
}
