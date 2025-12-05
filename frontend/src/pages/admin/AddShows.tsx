import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import type { Movie } from "../MovieDetails";
import Loading from "../../components/Loading";
import Title from "./Title";
import { Calendar, CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
import BlurCircle from "../../components/BlurCircle";
import kConvertor from "../../lib/kConvertor";

type DateTime = {};

function AddShows() {
  const currency = import.meta.env.VITE_CURRENCY;
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);

  const [selectedMovie, setSelectedMovie] = useState<number>(0);

  const [dateTimeSelection, setDateTimeSelection] = useState<
    Record<string, string[]>
  >({});

  const [dateTimeInput, setDateTimeInput] = useState("");

  const [showPrice, setShowPrice] = useState("");

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      } else {
        return prev;
      }
    });
  };

  // Store the extracted value in a variable named _, but we don’t plan to use it. _.value = prev[date]; const {[date]:_,...rest} =prev;
  const handleDateTimeRemove = (date: string, time: string) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = (prev[date] ?? []).filter((t) => t !== time);

      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      } else {
        return {
          ...prev,
          [date]: filteredTimes,
        };
      }
    });
  };
  const fetchNowPlayingMovies = async () => {
    setNowPlayingMovies(dummyShowsData);
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <div className="relative">
        <BlurCircle top="-0px" left="50px" />
      </div>
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
      <div className="overflow-x-auto no-scrollbar pb-4 relative">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {nowPlayingMovies.map((movie) => {
            return (
              <div
                onClick={() => {
                  setSelectedMovie((prev) =>
                    prev === movie.id ? 0 : movie.id
                  );
                }}
                key={movie.id}
                className={`relative max-w-40 
              
              cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300 `}
              >
                <div className="relative rounded-lg overflow-hidden ">
                  <img
                    src={movie.poster_path}
                    className="w-full  object-cover brightness-90"
                  />
                  <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                    <p className="flex items-center gap-1 text-gray-400">
                      <StarIcon className="w-4 h-4 text-primary fill-primary" />
                      {movie.vote_average.toFixed(1)}
                    </p>
                    <p className="text-gray-300">
                      {kConvertor(movie.vote_count)} Votes
                    </p>
                  </div>
                </div>
                {selectedMovie === movie.id && (
                  <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                    <CheckIcon
                      className="w-4 h-4 text-white "
                      strokeWidth={2.5}
                    />
                  </div>
                )}
                <div>
                  <p className="font-medium truncate">{movie.title}</p>
                  <p className="text-gray-400 text-sm">{movie.release_date}</p>
                  <p className="text-gray-300 text-xs truncate">
                    {movie.genres
                      .slice(0, 2)
                      .map((genre) => genre.name)
                      .join(", ")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div
          className="inline-flex items-center gap-2 border border-primary/20 px-3 py-2 rounded-md bg-primary/10 text-gray-400
        max-w-50 overflow-hidden"
        >
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            onChange={(e) => setShowPrice(e.target.value)}
            min={0}
            type="number"
            value={showPrice}
            placeholder="Enter show price"
            className="outline-none"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm  font-medium mb-2">
          Select Date and Time
        </label>
        <div className="inline-flex gap-5  border p-1 pl-3 rounded-lg bg-primary/10 border-primary/20 ">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="outline-none rounded-md cursor-pointer text-gray-400
          "
          />

          <button
            onClick={handleDateTimeAdd}
            className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary/70 transition duration-300 cursor-pointer"
          >
            Add Time
          </button>
        </div>
      </div>

      {Object.keys(dateTimeSelection).length > 0 && (
        <div>
          <h2>Selected Date-Time</h2>
          <ul>
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div>{date}</div>
                <div>
                  {times.map((time) => (
                    <div key={time}>
                      <span>{time}</span>
                      <DeleteIcon
                        onClick={() => {
                          handleDateTimeRemove(date, time);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  ) : (
    <Loading />
  );
}

export default AddShows;
