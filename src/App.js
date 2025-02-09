import { AllRoutes } from "./routes/AllRoutes";
import { Header } from './components';
import { Notification } from "./components";
import { useEffect } from "react";
import { initializeAuth } from "./services/authService";
import { useDispatch, useSelector } from "react-redux";
import { HeaderSkeleton, HomeSkeleton } from "./components/skeletons";

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
        <>
          <HeaderSkeleton />
          <HomeSkeleton />
        </>
      )}

      
    </div>
  );
}

export default App;
