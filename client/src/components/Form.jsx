import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Form = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { setShowForm, setToken, backendURL } = useContext(AppContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/user/login" : "/api/user/register";

    try {
      const { data } = await axios.post(`${backendURL}${endpoint}`, {
        formData,
      });
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.error || "Something went wrong!");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  return (
    <div className="fixed inset-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="relative bg-white p-10 rounded-xl text-slate-500"
        initial={{ opacity: 0.2, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={assets.cross_icon}
          alt="Close"
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => setShowForm(false)}
        />

        <h1 className="text-center text-2xl text-neutral-700 font-semibold capitalize">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        <p className="text-[#575B86] text-sm text-center pt-2">
          Welcome back! Please {isLogin ? "sign in" : "create an account"} to
          continue
        </p>

        {!isLogin && (
          <InputBox
            src={assets.user_icon}
            type="text"
            name="name"
            value={formData.name}
            handler={handleChange}
            placeholder="Full Name"
          />
        )}

        <InputBox
          src={assets.email_icon}
          type="email"
          name="email"
          value={formData.email}
          handler={handleChange}
          placeholder="Email"
        />

        <InputBox
          src={assets.lock_icon}
          type="password"
          name="password"
          value={formData.password}
          handler={handleChange}
          placeholder="Password"
        />

        <p className="text-sm text-blue-600 my-4 cursor-pointer">
          Forgot password?
        </p>

        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-full hover:bg-blue-700 transition-all"
        >
          {isLogin ? "Login" : "Create Account"}
        </button>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ name: "", email: "", password: "" });
            }}
            className="text-blue-600 cursor-pointer font-semibold"
          >
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default Form;

// InputBox component
const InputBox = ({
  src,
  type = "text",
  name = "",
  value,
  handler,
  placeholder = "",
}) => {
  return (
    <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
      <img src={src} alt="icon" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={handler}
        placeholder={placeholder}
        required
        autoComplete="on"
        spellCheck="false"
        className="outline-none text-sm flex-1 bg-transparent"
      />
    </div>
  );
};
