import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

// Function to check availabilty of seats
const checkSeatAvailability = async (showId, selectedSeats) => {
  const clash = await Show.findOne({
    _id: showId,
    $or: selectedSeats.map(seat => ({
      [`occupiedSeats.${seat}`]: { $exists: true }
    }))
  });

  return !clash;
};


// Creating booking data

export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;

    const available = await checkSeatAvailability(showId, selectedSeats);
    if (!available) {
      return res.json({
        success: false,
        message: "Some seats are already booked",
      });
    }

    const showData = await Show.findById(showId).populate("movie");

    // Create booking
    await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    // Update seats atomically
    for (const seat of selectedSeats) {
      showData.occupiedSeats[seat] = userId;
    }

    showData.markModified("occupiedSeats");
    await showData.save();

    return res.json({ success: true, message: "Booked successfully" });
  } catch (error) {
    console.log("Booking error:", error);
    return res.json({ success: false, message: error.message });
  }
};


export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    const showData = await Show.findById(showId);

    const occupiedSeats = Object.keys(showData.occupiedSeats);

    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.log("Error in fetching occupied seats", error.message);
    res.json({ success: false, message: error.message });
  }
};
