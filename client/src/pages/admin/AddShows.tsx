import { useEffect, useState } from "react";

import type Movie from "../../types/movie";
import Loading from "../../components/Loading/Loading";
import Title from "./Title";
import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
import BlurCircle from "../../components/BlurCircle/BlurCircle";
import kConvertor from "../../lib/kConvertor";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

interface NowPlayingSuccess {
  success: true;
  movies: Movie[];
}
interface NowPlayingError {
  success: false;
  message: string;
}

interface AddShowAPIResponse {
  success: boolean;
  message: string;
}

type NowPlayingAPIResponse = NowPlayingError | NowPlayingSuccess;

function AddShows() {
  const { axios, getToken, user, image_base_url } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);

  const [dateTimeSelection, setDateTimeSelection] = useState<
    Record<string, string[]>
  >({});

  const [dateTimeInput, setDateTimeInput] = useState<string>("");

  const [showPrice, setShowPrice] = useState<string>("");

  const [addingShow, setAddingShow] = useState<boolean>(false);

  const handleDateTimeAdd = () => {
    if (!selectedMovie) {
      return toast("Please Select a Movie");
    }

    const [date, time] = dateTimeInput.split("T");
    if (!date) {
      return toast("Please Select a Date");
    }
    if (!time) {
      return toast("Please Select a Time");
    }

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      } else {
        return prev;
      }
    });
  };
  const handleSubmit = async () => {
    try {
      setAddingShow(true);
      if (!selectedMovie) {
        return toast.error("Select a movie");
      }

      if (!showPrice) {
        return toast.error("Add show price");
      }
      if (Object.keys(dateTimeSelection).length === 0) {
        return toast("Click Add Show");
      }
      const showsInput = Object.entries(dateTimeSelection).map(
        ([date, time]) => ({ date, time })
      );

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice),
      };

      const token = await getToken();
      const { data } = await axios.post<AddShowAPIResponse>(
        "/api/show/add",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setSelectedMovie(null);
        setDateTimeSelection({});
        setShowPrice("");
        setDateTimeInput("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to add shows to database", error);
      toast.error("Please try again");
    } finally {
      setAddingShow(false);
    }
  };
  const handleDateTimeRemove = (date: string, time: string) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = (prev[date] ?? []).filter((t) => t !== time);

      if (filteredTimes.length === 0) {
        const rest = { ...prev };
        delete rest[date];
        return rest;
      } else {
        return {
          ...prev,
          [date]: filteredTimes,
        };
      }
    });
  };

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const { data } = await axios.get<NowPlayingAPIResponse>(
          "/api/show/now-playing",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.success) {
          setNowPlayingMovies(data.movies);
        }
      } catch (error) {
        console.log("Error fetching movies in add-shows section", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchNowPlayingMovies();
    }
  }, [user]);

  return !loading ? (
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
                    prev === movie.id ? null : movie.id
                  );
                }}
                key={movie.id}
                className={`relative max-w-40 
              
              cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300 `}
              >
                <div className="relative rounded-lg overflow-hidden ">
                  <img
                    src={image_base_url + movie.poster_path}
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
            Add Show
          </button>
        </div>
      </div>

      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2">Selected Date-Time</h2>
          <ul className="space-y-3">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className="font-medium">{date}</div>
                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                  {times.map((time) => (
                    <div
                      key={time}
                      className="flex border rounded items-center px-2 py-1 border-primary"
                    >
                      <span>{time}</span>
                      <DeleteIcon
                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                        width={15}
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
      <button
        onClick={handleSubmit}
        disabled={addingShow}
        className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer"
      >
        {addingShow ? "Adding..." : "Add Show"}
      </button>
    </>
  ) : (
    <Loading />
  );
}

export default AddShows;
