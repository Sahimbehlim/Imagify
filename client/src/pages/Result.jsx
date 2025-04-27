import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Result = () => {
  const [image, setImage] = useState(assets.banner);
  const [prompt, setPrompt] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, generateImage } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      return toast.info("Enter prompt to proceed!");
    }

    if (user.credits === 0) {
      toast.error("No credit balance!");
      return navigate("/buy");
    }

    try {
      setLoading(true);
      const { resultImage } = await generateImage(prompt);

      if (resultImage) {
        setIsImageLoaded(true);
        setImage(resultImage);
      } else {
        toast.error("Failed to generate image. Try again!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const resetGeneration = () => {
    setIsImageLoaded(false);
    setPrompt("");
    setImage(assets.banner);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col min-h-[90vh] justify-center items-center"
      initial={{ opacity: 0.2, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="relative">
        <img
          src={image}
          alt="Generated"
          className="max-w-sm object-contain shadow-md"
        />
        <span
          className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${
            loading
              ? "w-full animate-pulse transition-all duration-[10s]"
              : "w-0"
          }`}
        />
      </div>

      {loading && <p className="text-[#606060] mt-2">Loading...</p>}

      {!isImageLoaded ? (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-6 rounded-full">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate"
            className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder:text-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-zinc-900 hover:bg-zinc-800 px-10 sm:px-16 py-3 rounded-full transition-all disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-6 rounded-full">
          <button
            type="button"
            onClick={resetGeneration}
            className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer hover:bg-zinc-100 transition-all"
          >
            Generate Another
          </button>
          <a
            href={image}
            download
            className="bg-zinc-900 hover:bg-zinc-800 px-10 py-3 rounded-full transition-all"
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  );
};

export default Result;
