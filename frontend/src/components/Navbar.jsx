import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white bg-black">
      <h1 className="w-full text-3xl font-bold text-[#00df9a]">
        LET'S FIT SWOLE
      </h1>
      <ul className="hidden md:flex">
        <li className="p-4">
          <a style={{ textDecoration: "none", color: "white" }} href="#Home">
            Home
          </a>
        </li>
        <li className="p-4">
          <a style={{ textDecoration: "none", color: "white" }} href="#About">
            About
          </a>
        </li>
        <li className="p-4">
          <a
            style={{ textDecoration: "none", color: "white" }}
            href="https://natekarnsportfolio.netlify.app/"
          >
            Contact
          </a>
        </li>
      </ul>
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <ul
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
            : "ease-in-out duration-500 fixed left-[-100%]"
        }
      >
        <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">
          LET'S FIT SWOLE
        </h1>
        <li className="p-4 border-b border-gray-600">Home</li>
        <li className="p-4 border-b border-gray-600">About</li>
        <li className="p-4">Contact</li>
      </ul>
    </div>
  );
};

export default Navbar;
