import { AllRoutes } from "./routes/AllRoutes";
import { Header } from './components';
import { Notification } from "./components";
import { useEffect } from "react";
import { initializeAuth } from "./services/authService";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch()
  const loading = useSelector(state => state.authState.loading)

  useEffect(() => {
    initializeAuth(dispatch)
  }, [dispatch])

  return (
    <div className="App dark:bg-gray-900">
      {!loading ? (
        <>
          <Header />
          <AllRoutes />
          <Notification />
        </>
      ) : (
        <div>LOADING</div>
      )}

      
    </div>
  );
}

export default App;
