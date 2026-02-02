import { clerkClient } from "@clerk/express";

import { prisma } from "../prisma/client.js";

// API function to get user bookings

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.auth().userId;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        show: {
          include: {
            movie: true,
          },
        },
        seats: true,
      },
    });

    // 🔴 IMPORTANT: keep frontend unchanged
    const formattedBookings = bookings.map((b) => ({
      ...b,
      bookedSeats: b.seats.map((s) => s.seatNo),
    }));

    res.json({ success: true, bookings: formattedBookings });
  } catch (error) {
    console.error("Error in fetching users booking", error);
    res.status(500).json({ success: false, message: error.message });
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

    const movies = await prisma.movie.findMany({
      where: {
        id: { in: favorites },
      },
    });

    res.json({ success: true, movies });
  } catch (error) {
    console.log("Failed to fetch favorite movies", error.message);
    res.json({ success: false, message: error.message });
  }
};
