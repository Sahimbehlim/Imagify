import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { user, setShowForm, logoutHandler } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => logoutHandler();
  const handleLogin = () => setShowForm(true);
  const handleBuyCredits = () => navigate("/buy");

  return (
    <nav className="flex items-center justify-between py-4">
      <Link to="/">
        <img
          src={assets.logo}
          alt="Imagify logo"
          className="w-28 sm:w-32 lg:w-40"
        />
      </Link>

      {user ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleBuyCredits}
            className="flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-transform duration-500"
          >
            <img src={assets.credit_star} alt="Credit star" className="w-5" />
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Credits left : {user.credits}
            </span>
          </button>

          <span className="text-gray-600 max-sm:hidden pl-4">
            Hi, {user.name}
          </span>

          <div className="relative group">
            <img
              src={assets.profile_icon}
              alt="Profile icon"
              className="w-10 drop-shadow"
            />
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 pt-12">
              <ul className="p-2 bg-white rounded-md border text-sm">
                <li
                  onClick={handleLogout}
                  className="py-1 px-2 cursor-pointer hover:bg-gray-100 rounded"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-5">
          <p
            onClick={handleBuyCredits}
            className="cursor-pointer text-gray-700"
          >
            Pricing
          </p>
          <button
            onClick={handleLogin}
            className="bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full  hover:scale-95 transition-transform duration-500"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
