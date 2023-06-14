import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <main>
        <Outlet />
      </main>

      <ToastContainer />
    </div>
  );
}

export default App;
