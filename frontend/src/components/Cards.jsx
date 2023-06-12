import React from "react";
import { useNavigate } from "react-router-dom";

const Cards = () => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="w-full py-[10rem] px-4 bg-white">
      <div className="max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8">
        <div className="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300">
          {/* <img className='w-20 mx-auto mt-[-3rem] bg-white' src={Single} alt="/" /> */}
          <h2 className="text-2xl font-bold text-center py-8">Collaboration</h2>
          <p className="text-center text-4xl font-bold">LET'S</p>
          <div className="text-center font-medium">
            <p className="py-2 border-b mx-8 mt-8">See others workouts</p>
            <p className="py-2 border-b mx-8">Share your workouts</p>
            <p className="py-2 border-b mx-8">Compete</p>
          </div>
          <button
            onClick={handleClick}
            className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3"
          >
            Get Started
          </button>
        </div>
        <div className="w-full shadow-xl bg-gray-100 flex flex-col p-4 md:my-0 my-8 rounded-lg hover:scale-105 duration-300">
          {/* <img className='w-20 mx-auto mt-[-3rem] bg-transparent' src={Double} alt="/" /> */}
          <h2 className="text-2xl font-bold text-center py-8">Customization</h2>
          <p className="text-center text-4xl font-bold">FIT</p>
          <div className="text-center font-medium">
            <p className="py-2 border-b mx-8 mt-8">Unlimited Customization</p>
            <p className="py-2 border-b mx-8">Unlimited Workouts</p>
            <p className="py-2 border-b mx-8">Unlimited Potential</p>
          </div>
          <button
            onClick={handleClick}
            className="bg-black text-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3"
          >
            Get Started
          </button>
        </div>
        <div className="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300">
          {/* <img className='w-20 mx-auto mt-[-3rem] bg-white' src={Triple} alt="/" /> */}
          <h2 className="text-2xl font-bold text-center py-8">
            Categorization
          </h2>
          <p className="text-center text-4xl font-bold">SWOLE</p>
          <div className="text-center font-medium">
            <p className="py-2 border-b mx-8 mt-8">Categorize by day</p>
            <p className="py-2 border-b mx-8">Categorize by workout</p>
            <p className="py-2 border-b mx-8">Categorize by exercise</p>
          </div>
          <button
            onClick={handleClick}
            className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
