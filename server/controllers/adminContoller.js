import Show from "../models/Show.js";
import User from "../models/User.js";

// API to check is user is admin

export const isAdmin = async (req, res) => {
  res.json({ success: true, isAdmin: true });
};

// API to get dashboard data

export const getDashboardData = async (req, res) => {
  try {
    const bookings = await Booking.find({ isPaid: true });

    const activeShows = await Show.find({
      showDateTime: { $gte: new Date() },
    }).populate("movie");

    const totalUser = await User.countDocuments();

    const dashBoardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, curr) => acc + curr.amount, 0),
      activeShows,
      totalUser,
    };

    res.json({ success: true, dashBoardData });
  } catch (error) {
    console.log("Error in fetching admin dashboard data", error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all shows

export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find()
      .populate("movie")
      .sort({ showDateTime: 1 });

    const showIds = shows.map((s) => s._id.toString());

    // Aggregate from Postgres
    const bookings = await prisma.booking.groupBy({
      by: ["showId"],
      where: { showId: { in: showIds } },
      _count: { _all: true },
      _sum: { amount: true },
    });

    const bookingMap = {};
    bookings.forEach((b) => {
      bookingMap[b.showId] = {
        totalBookings: b._count._all,
        totalRevenue: b._sum.amount || 0,
      };
    });

    const response = shows.map((show) => {
      const stats = bookingMap[show._id.toString()] || {
        totalBookings: 0,
        totalRevenue: 0,
      };

      return {
        ...show.toObject(),
        totalBookings: stats.totalBookings,
        totalRevenue: stats.totalRevenue,
      };
    });

    res.json({ success: true, shows: response });
  } catch (error) {
    console.error("Admin show list error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all bookings

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user")
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log("Error in fetching list bookings for admin", error);
    res.json({ success: false, message: error.message });
  }
};
