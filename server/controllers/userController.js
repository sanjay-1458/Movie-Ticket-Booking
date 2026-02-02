import { clerkClient } from "@clerk/express";

import Movie from "../models/Movie.js";

// API function to get user bookings

import { prisma } from "../prisma/client.js";
import Show from "../models/Show.js";

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.auth().userId;

    // 1. Get bookings + seats from PostgreSQL
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        seats: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Enrich with Mongo Show + Movie
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const show = await Show.findById(booking.showId).populate("movie");

        return {
          _id: booking.id, // frontend expects _id
          amount: booking.amount,
          isPaid: booking.isPaid,
          paymentLink: booking.paymentLink,
          bookedSeats: booking.seats.map((s) => s.seatNo),
          show, // full Mongo show (with movie)
        };
      }),
    );

    res.json({ success: true, bookings: enrichedBookings });
  } catch (error) {
    console.error("Error in fetching user bookings", error);
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
