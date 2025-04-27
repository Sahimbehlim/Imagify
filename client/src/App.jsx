import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home, Result, BuyCredit } from "./pages/index";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Form from "./components/Form";
import { AppContext } from "./context/AppContext";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { showForm, token } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-orange-50 px-4 sm:px-10 md:px-14 lg:px-28">
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        pauseOnHover={false}
      />
      <Navbar />
      {showForm && <Form />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/result"
          element={token ? <Result /> : <Navigate to="/" />}
        />
        <Route path="/buy" element={<BuyCredit />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
