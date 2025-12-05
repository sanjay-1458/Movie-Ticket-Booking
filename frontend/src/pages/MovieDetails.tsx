import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircle, PlayIcon, StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export type Movie = {
  poster_path: string;
  title: string;
  vote_count:number;
  vote_average: number;
  overview: string;
  id:number;
  runtime: number;
  genres: { id: number; name: string }[];
  release_date: string;
  casts: { name: string; profile_path: string }[];
  _id: string;
};

export type DateTime = Record<string, { time: string; showId: string }[]>;

function MovieDetails() {
  const { id } = useParams();
  const [show, setShow] = useState<{ movie: Movie; dateTime: DateTime } | null>(null);
  const navigate = useNavigate();

  const getShow = async () => {
    const currShow = dummyShowsData.find((movie) => movie._id === id);

    if (currShow) {
      setShow({
        movie: currShow,
        dateTime: dummyDateTimeData,
      });
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);
  return show ? (
    <div className="px-6 md:px-16  lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={show.movie.poster_path}
          alt={show.movie.title}
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-primary ">ENGLISH</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">
            {show.movie.title}
          </h1>
          <div className="flex gap-2 items-center">
            <StarIcon className="text-primary fill-primary w-5 h-5" />
            <p className="text-gray-300 font-medium">
              {show.movie.vote_average.toFixed(1)} IMDb Rating
            </p>
          </div>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {show.movie.overview}
          </p>
          <div className="flex items-center gap-1 text-s text-gray-300 flex-wrap">
            <p>{timeFormat(show.movie.runtime)}</p>
            <p>•</p>
            <p>
              {show.movie.genres.map((genre) => genre.name).join(" | ")}
            </p>{" "}
            <p>•</p>
            <p>{show.movie.release_date.split("-")[0]}</p>
          </div>
          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex gap-2 items-center px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
              <PlayCircle className="w-5 h-5" />
              Watch Trailer
            </button>
            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-primary rounded-md font-medium hover:bg-primary/80 cursor-pointer transition active:scale-95"
            >
              Buy Tickets
            </a>
            <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
              <Heart className={`w-5 h-5`} />
            </button>
          </div>
        </div>
      </div>
      <p className="text-lg font-medium mt-20">Your Favorite Cast</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4">
          {show.movie.casts.slice(0, 12).map((cast, index) => (
            <div
              key={index}
              className="grid grid-rows-2  items-center text-center"
            >
              <div className="h-20 w-20 rounded-full overflow-hidden">
                <img
                  src={cast.profile_path}
                  alt={cast.name}
                  className="rounded-full h-20 w-20  object-cover object-top
             border-2 border-red-500 "
                />
              </div>
              <p className="font-medium text-xs mt-3">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>
      <DateSelect dateTime={show.dateTime} id={show.movie._id} />

      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {dummyShowsData.slice(0, 4).map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
      <div className="flex justify-center mt-20">
        <button
          className="bg-primary hover:bg-primary/80 transition-all px-10 py-3 text-sm rounded-lg font-medium cursor-pointer"
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
        >
          Show more
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default MovieDetails;
