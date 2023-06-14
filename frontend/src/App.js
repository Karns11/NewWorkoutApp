import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <main>
        <Outlet />
      </main>

      <ToastContainer />
      <Footer />
    </div>
  );
}

export default App;
