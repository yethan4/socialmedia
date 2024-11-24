import { AllRoutes } from "./routes/AllRoutes";
import { Header } from './components/layouts/Header';
import { Notification } from "./components";
import { useEffect } from "react";
import { initializeAuth } from "./firebase/firebaseUtils";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch()
  const loading = useSelector(state => state.authState.loading)

  useEffect(() => {
    initializeAuth(dispatch)
  }, [])

  return (
    <div className="App">
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
