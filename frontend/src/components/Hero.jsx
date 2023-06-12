import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleHeroClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div id="Home" className="text-white bg-black">
      <div className="max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center">
        <p className="text-[#00df9a] font-bold p-2">
          THE BESST FITNESS APP ON THE MARKET
        </p>
        <h1 className="md:text-7xl sm:text-6xl text-4xl font-bold md:py-6">
          LET'S FIT SWOLE
        </h1>
        <p className="md:text-2xl text-xl font-bold text-gray-500">
          TAKE YOUR WORKOUTS TO THE NEXT LEVEL
        </p>
        <button
          onClick={handleHeroClick}
          className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;
