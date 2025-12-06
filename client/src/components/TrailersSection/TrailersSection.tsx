import React from "react";
import { dummyTrailers } from "../../assets/assets";
import ReactPlayer from "react-player";
import BlurCircle from "../BlurCircle/BlurCircle";
import { PlayCircleIcon } from "lucide-react";

type Trailer = {
  image: string;
  videoUrl: string;
};

function TrailersSection() {
  const [currentTrailer, setCurrentTrailer] = React.useState<Trailer>(
    dummyTrailers[0]
  );

  return (
    <div className=" px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden ">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
        Trailers
      </p>
      <div className="relative mt-6">
        <BlurCircle top="-100px" right="-100px" />
        <ReactPlayer
          className="mx-auto max-w-full rounded-lg overflow-hidden"
          src={currentTrailer.videoUrl}
          playing={false}
          controls={false}
          width="960px"
          height="540px"
        />
      </div>
      <div className="group grid grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto max-md:grid-cols-2 px-4 md:px-8 lg:px-16 max-md:w-70 max-md:mt-6">
        {dummyTrailers.map((trailer) => {
          return (
            <div
              key={trailer.image}
              className="relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition max-md:h-40 md:max-h-60 cursor-pointer mt-4 md:mt-8 "
              onClick={() => {
                setCurrentTrailer(trailer);
              }}
            >
              <img
                src={trailer.image}
                alt="Trailer Image"
                className="rounded-lg w-full h-full object-cover brightness-75"
              />
              <PlayCircleIcon
                strokeWidth={1.6}
                className="absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrailersSection;
