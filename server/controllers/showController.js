import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

// API to get the now playing movies from TMDB API

let cachedMovies = null;
let cacheTime = 0;
let cachedMovieDetails = {};
const CACHE_DURATION = 5 * 60 * 1000;

export const getNowPlayingMovies = async (req, res) => {
  try {
    const now = Date.now();

    if (cachedMovies && now - cacheTime < CACHE_DURATION) {
      console.log("Serving data from cache");
      return res.json({ success: true, movies: cachedMovies });
    }

    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    const movies = data.results;

    res.json({ success: true, movies: movies });
    cacheTime = Date.now();
    cachedMovies = data.results;
    
  } catch (error) {
    console.log("Error in fetching now playing movies", error);

    if (cachedMovies) {
      console.log("API request fail, sending cached movies");
      return res.json({ success: true, movies: cachedMovies });
    }

    res.json({ success: false, message: error.message });
  }
};

// API to add a new show to database

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;
    let movie = await Movie.findById(movieId);

    if (!movie) {
      const now = Date.now();
      // Fetch movie with the given id
      if (
        cachedMovieDetails[movieId] &&
        now - cachedMovieDetails[movieId].cacheTime < CACHE_DURATION
      ) {
        movie = cachedMovieDetails[movieId].data;
        console.log("Serving movie details from cache");
      } else {
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

        console.log(movieAPIData.title, movieCreditsData.cast[0].name);

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
          vote_count: movieAPIData.vote_count,
          id: movieAPIData.id,
          runtime: movieAPIData.runtime,
        };

        cachedMovieDetails[movieId] = {
          data: movieDetails,
          cacheTime: Date.now(),
        };

        // Adding movie to database

        await Movie.create(movieDetails);
      }
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
    console.log("Failed to fetch movie details. Try agin later.", error);
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

    return res.json({ success: true, shows: Array.from(uniqueShows) });
  } catch (error) {
    console.log("Error in loading shows to display movie list", error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get a single show form database

export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({
      movie: { $eq: movieId },
      showDateTime: { $gte: new Date() },
    });
    const movie = await Movie.findById(movieId);

    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];

      if (!dateTime[date]) {
        dateTime[date] = [];
      }

      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
        showPrice: show.showPrice
      });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.log("Error in loading detail of single movie", error.message);
    res.json({ success: false, message: error.message });
  }
};
