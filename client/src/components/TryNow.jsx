import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const TryNow = () => {
  const { user, setShowForm } = useContext(AppContext);
  const navigate = useNavigate();

  const handleClick = () => {
    user ? navigate("/result") : setShowForm(true);
  };

  return (
    <motion.section
      className="pb-16 text-center"
      initial={{ opacity: 0.2, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl sm:text-4xl font-semibold mt-4 text-neutral-800 py-6 md:py-10">
        See the magic. Try now
      </h2>

      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white m-auto hover:scale-105 transition-transform duration-500"
      >
        Generate Images
        <img
          src={assets.star_group}
          alt="Generate images star"
          className="h-6"
        />
      </button>
    </motion.section>
  );
};

export default TryNow;
