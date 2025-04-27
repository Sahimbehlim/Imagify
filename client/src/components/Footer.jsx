import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="flex items-center justify-between gap-4 pt-3 pb-4 mt-16">
      <Link to="/">
        <img src={assets.logo} alt="Imagify logo" className="w-28 sm:w-32" />
      </Link>

      <p className="flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden">
        All right reserved. Copyright @imagify
      </p>

      <div className="flex gap-2 sm:gap-3 text-md sm:text-xl">
        <IconLink
          href="https://www.linkedin.com/in/your-linkedin-id"
          iconClass="ri-linkedin-fill"
        />
        <IconLink
          href="https://github.com/your-github-username"
          iconClass="ri-github-fill"
        />
      </div>
    </footer>
  );
};

const IconLink = ({ href, iconClass }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 border rounded-full border-black w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
    >
      <i className={iconClass}></i>
    </a>
  );
};

export default Footer;
