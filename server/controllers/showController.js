import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

// API to get the now playing movies from TMDB API

export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    const movies = data.results;

    res.json({ sucess: true, movies: movies });
  } catch (error) {
    console.log(
      "Error in fetching now playing movies for Admin section",
      error
    );
    res.json({ success: false, message: error.message });
  }
};

// API to add a new show to database

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;
    let movie = await Movie.findById(movieId);

    if (!movie) {
      // Fetch movie with the given id

      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
      ]);

      const movieAPIData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieAPIData.title,
        overview: movieAPIData.overview,
        poster_path: movieAPIData.poster_path,
        backdrop_path: movieAPIData.backdrop_path,
        release_date: movieAPIData.release_date,
        original_language: movieAPIData.original_language,
        tagline: movieAPIData.tagline || "",
        genres: movieAPIData.genres,
        casts: movieCreditsData.cast,
        vote_average: movieAPIData.vote_average,
        runtime: movieAPIData.runtime,
      };
      // Adding movie to database

      await Movie.create(movieDetails);
    }

    const showsToCreate = [];

    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;

        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }
    res.json({ success: true, message: "Show Added Successfully" });
  } catch (error) {
    console.log("Error in Add Show", error.essage);
    res.json({ success: false, message: error.message });
  }
};

// API to get all shows from the database

export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // filtering unique shows

    const uniqueShows = new Set(shows.map((show) => show.movie));
     
    return res.json({status:true,shows:Array.from(uniqueShows)})
  } catch (error) {
    console.log("Error in loading shows in the Home page", error.essage);
    res.json({ success: false, message: error.message });
  }
};


