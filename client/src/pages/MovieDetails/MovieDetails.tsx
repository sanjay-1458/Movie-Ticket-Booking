import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BlurCircle from "../../components/BlurCircle/BlurCircle";
import { Heart, PlayCircle, StarIcon } from "lucide-react";
import timeFormat from "../../lib/timeFormat";
import DateSelect from "../../components/DateSelect/DateSelect";
import MovieCard from "../../components/MovieCard/MovieCard";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import type Movie from "../../types/movie";

interface DateTime {
  [date: string]: { time: string; showId: string }[];
}
interface MovieDetailSuccess {
  success: true;
  movie: Movie;
  dateTime: DateTime;
}
interface MovieDetailError {
  success: false;
  message: string;
}

type MovieDetailsAPIResponse = MovieDetailError | MovieDetailSuccess;

interface UpdateFavoriteAPIResponse{
  success:boolean;
  message:string;
}

function MovieDetails() {
  const { shows, axios, getToken, user, fetchFavoriteMovies, image_base_url,favoriteMovies } =
    useAppContext();

  const { id } = useParams();
  const [show, setShow] = useState<Omit<MovieDetailSuccess, "success"> | null>(
    null
  );
  const navigate = useNavigate();

  const handleFavorite = async()=>{
    try {
      if(!user){
        return toast.error("Please login to proceed");
      }
      const token = await getToken();
      const {data} = await axios.post<UpdateFavoriteAPIResponse>('/api/user/update-favorite',{movieId:id},{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(data.success) {
        await fetchFavoriteMovies()
        toast.success('Updated favorite')
      }
      else{
        toast.error('Failed to upadte favorite')
      }

    } catch (error) {
      console.log("Failed to update favorite",error);
    }
  }

  useEffect(() => {
    const getShow = async () => {
      try {
        const token = await getToken();
        const { data } = await axios<MovieDetailsAPIResponse>(
          `/api/show/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(data);
        if (data.success) {
          setShow({ movie: data.movie, dateTime: data.dateTime });
        } else {
          toast.error("Error in fecthing movie detail.");
        }
      } catch (error) {
        console.log(error);
      }
    };
      getShow();
    
  }, [id]);



  return show ? (
    <div className="px-6 md:px-16  lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={image_base_url + show.movie.poster_path}
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
            <button
            onClick={handleFavorite}
            className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
              <Heart className={`w-5 h-5 ${favoriteMovies.find(movie=>movie._id==id)?"fill-primary text-primary":""} `} />
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
                  src={image_base_url + cast.profile_path}
                  alt={cast.name}
                  className="rounded-full h-20 w-20  object-cover object-top
             border"
                />
              </div>
              <div className="">
                <p className="text-gray-400 text-xs font-light">{cast.character}</p>
                <p className="font-medium text-xs">{cast.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DateSelect dateTime={show.dateTime} id={show.movie._id} />

      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {shows.slice(0, 4).map((movie) => (
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
