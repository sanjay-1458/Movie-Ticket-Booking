import React from "react";
import { assets } from "../assets/assets";
import { ArrowBigRight, ArrowRight, CalculatorIcon, Calendar1Icon, Clock10Icon, Clock3Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
    const naviagte = useNavigate();
  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen'>
      <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20" />
      <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">
        Guardians
        <br /> of the Galaxy
      </h1>
      <div className="flex items-center gap-4 text-gray-300">
        <span>Action | Adventure | Sci-Fi</span>
        <div className="flex items-center gap-1">
            <Calendar1Icon className="w-4.5 h-4.5"/> 2018
        </div>
        <div className="flex items-center gap-1">
            <Clock3Icon className="w-4.5 h-4.5"/> 2h 8m
        </div>
      </div>
      <p className="max-w-md text-gray-300">
        In a post-apocalyptic world where cities ride on wheels and consume each other to survive, two people meet in London and try to stop a conspiracy.
      </p>
      <button className="text-sm hover:bg-primary-dull transition font-medium bg-primary rounded-full flex items-center px-6 py-3 cursor-pointer gap-1" onClick={()=>naviagte('/movies')}>Explore Movies
        <ArrowRight className="w-5 h-5"/>
      </button>
    </div>
  );
}

export default HeroSection;
