import { assets } from "../../assets/assets";
import { ArrowRightIcon, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] h-screen bg-cover bg-center'>
      <img
        src={assets.marvelLogo}
        alt="Marvel Logo"
        className="max-h-11 lg:h-11 mt-20"
      ></img>
      <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">
        Guardians<br></br>of the Galaxy
      </h1>
      <div className="flex items-center gap-4 text-gray-300">
        <span>Action | Adventure | Sci-Fi</span>
        <div className="flex items-center gap-1">
          <Calendar className="w-4.5 h-4.5" />
          <span>2018</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4.5 h-4.5" />
          <span>2h 8m</span>
        </div>
      </div>
      <p className="text-gray-300 max-w-md">
        In a post-apocalyptic world where cities ride on wheels and consume each
        other to survive, two people meet in London and try to stop a
        conspiracy.
      </p>
      <button
        className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        onClick={() => navigate("/movies")}
      >
        Explore Movies
        <ArrowRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

export default HeroSection;
