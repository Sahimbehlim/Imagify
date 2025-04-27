import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const loadUserData = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/user/credits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUser({
          name: data.user.name,
          credits: data.user.credits,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error(error.response?.data?.error || "Failed to load user data");
    }
  };

  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/image/generate`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prev) => ({ ...prev, credits: data.creditBalance }));
      return data;
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error.response?.data?.error || "Failed to generate image");
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      loadUserData();
    }
  }, [token]);

  const contextValue = {
    user,
    setUser,
    showForm,
    setShowForm,
    token,
    setToken,
    backendURL,
    loadUserData,
    logoutHandler,
    generateImage,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
