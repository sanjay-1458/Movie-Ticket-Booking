import { clerkClient } from "@clerk/express";
import Movie from "../models/Movie.js";
import { prisma } from "../prisma/client.js";
import Show from "../models/Show.js";
// API function to get user bookings

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.auth();

    // 1. Get bookings from SQL
    const sqlBookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Hydrate with MongoDB data
    const populatedBookings = await Promise.all(sqlBookings.map(async (booking) => {
      const showDetails = await Show.findById(booking.showId).populate("movie");
      return {
        ...booking,
        show: showDetails // This provides item.show.movie for your frontend
      };
    }));

    res.json({ success: true, bookings: populatedBookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Adding / Removing favorite movie in Clerk user metadata

export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);

    if (!user.privateMetadata.favorite) {
      user.privateMetadata.favorite = [];
    }
    if (!user.privateMetadata.favorite.includes(movieId)) {
      user.privateMetadata.favorite.push(movieId);
    } else {
      user.privateMetadata.favorite = user.privateMetadata.favorite.filter(
        (movie) => movie !== movieId,
      );
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: user.privateMetadata,
    });
    res.json({ success: true, message: "Favorite movie updated" });
  } catch (error) {
    console.log(
      "Failed to update favorite movie in Clerk user metadata",
      error.message,
    );
    res.json({ success: false, message: error.message });
  }
};

// API to fetch the list of favorite movies

export const getFavorites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId);
    const favorites = user.privateMetadata.favorite;

    const movies = await Movie.find({ _id: { $in: favorites } });

    res.json({ success: true, movies });
  } catch (error) {
    console.log("Failed to fetch favorite movies", error.message);
    res.json({ success: false, message: error.message });
  }
};
