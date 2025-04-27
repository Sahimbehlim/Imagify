import { useContext } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { assets, sample_images } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { user, setShowForm } = useContext(AppContext);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    user ? navigate("/result") : setShowForm(true);
  };

  return (
    <motion.div
      className="flex flex-col justify-center items-center text-center my-20"
      initial={{ opacity: 0.2, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500">
        <p>Best text to image generator</p>
        <img src={assets.star_icon} alt="Star Icon" />
      </div>

      <h1 className="text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-10">
        Turn text to <span className="text-blue-600">image</span>, in seconds.
      </h1>

      <p className="max-w-xl mx-auto mt-5 text-neutral-700">
        Unleash your creativity with AI. Turn your imagination into visual art
        in seconds - just type, and watch the magic happen.
      </p>

      <button
        onClick={handleButtonClick}
        className="sm:text-lg text-white bg-black mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full hover:scale-105 duration-500"
      >
        Generate Images{" "}
        <img src={assets.star_group} alt="Star Group" className="h-6" />
      </button>

      <div className="flex flex-wrap justify-center gap-3 mt-10">
        {sample_images.map((item, index) => (
          <img
            key={index}
            src={item}
            alt={`Sample ${index + 1}`}
            width={70}
            className="rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-12"
          />
        ))}
      </div>

      <p className="mt-2 text-neutral-600">Generated images from imagify</p>
    </motion.div>
  );
};

export default Header;
