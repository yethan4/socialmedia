import { AllRoutes } from "./routes/AllRoutes";
import { Header } from './components/layouts/Header';
import { Notification } from "./components";

function App() {
  return (
    <div className="App">
      <Header />
      <AllRoutes />
      <Notification />
    </div>
  );
}

export default App;
