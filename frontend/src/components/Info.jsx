import React from "react";
import exercise from "../assets/hero_image.png";
import { useNavigate } from "react-router-dom";

const Info = () => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div id="About" className="w-full bg-white py-16 px-4">
      <div className="max-w-[1240px] mx-auto grid md:grid-cols-2">
        <div className="flex flex-col justify-center text-center">
          <p className="text-[#00df9a] font-bold ">EXERCISES DASHBOARD</p>
          <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold py-2">
            Manage Your workouts Centrally
          </h1>
          <p>
            LET'S FIT SWOLE allows you to categorize and manage your workouts by
            day. This allows you to stay more organized and will help you reach
            your fitness goals faster. Also, add specific exercises to each
            workout or explore exercises to add to your workouts. Add freinds to
            stay up to date with buddies and spark competition.
          </p>
          <div className="w-full flex justify-center">
            <button
              onClick={handleClick}
              className="bg-black text-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3"
            >
              Get Started
            </button>
          </div>
        </div>
        <img className="w-[300px] mx-auto my-4" src={exercise} alt="workout" />
      </div>
    </div>
  );
};

export default Info;
