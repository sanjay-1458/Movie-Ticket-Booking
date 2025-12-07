import { Star } from "lucide-react";

import { useNavigate } from "react-router-dom";
import timeFormat from "../../lib/timeFormat.ts";
type MovieCardProps = {
  _id: string;
  title: string;
  backdrop_path: string;
  release_date: string;
  genres: { id: number; name: string }[];
  runtime: number;
  vote_average: number;
};

function MovieCard({ movie }: { movie: MovieCardProps }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800/60 rounded-2xl hover:-translate-y-1 transition duration-300 w-66
    
    max-md:w-50 max-md:h-70">
      <img
        src={movie.backdrop_path}
        alt="Movie Poster"
        className="rounded-lg h-52 w-full object-cover object-bottom-right cursor-pointer"
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          scrollTo(0, 0);
        }}
      />
      <p className="font-semibold mt-2 truncate">{movie.title}</p>
      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()} •{" "}
        {movie.genres
          .slice(0, 2)
          .map((genre) => genre.name)
          .join(" | ")}{" "}
        • {timeFormat(movie.runtime)}
      </p>
      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          className="bg-primary hover:bg-primary-dull transition font-medium px-4 py-1 rounded-full text-xs cursor-pointer"
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
        >
          Buy Tickets
        </button>
        <p className="flex items-center gap-1 text-sm text-gray-400 pr-1">
          <Star className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;
