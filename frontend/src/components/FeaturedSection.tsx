import { ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import {dummyShowsData} from "../assets/assets"

export default function FeaturedSection(){
    const navigate=useNavigate();
    return (
        <div className=" px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
            <div className="relative flex items-center justify-between pt-20 pb-10">
                <BlurCircle top="0" right="-80px" />
                <p className="text-gray-300 font-medium text-lg">Now Showing</p>
                <button className="flex items-center gap-2 text-sm text-gray-300 group cursor-pointer" onClick={()=>{
                    navigate("/movies")
                }}>View All
                    <ArrowRightIcon className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition duration-200" />
                </button>
            </div>
            <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8 justify-start">
                {
                    dummyShowsData.slice(0,4).map((movie)=>{
                        return <MovieCard  key={movie._id} movie={movie} />
                    })
                }
            </div>
            <div className="flex justify-center mt-20">
                <button className="px-10 bg-primary py-3 text-sm hover:bg-primary-dull transition cursor-pointer rounded-md font-medium" onClick={()=>{navigate("/movies"); scrollTo(0,0)}}>Show More</button>
            </div>
        </div>
    )
}