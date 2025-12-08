// Function to check availabilty of seats

import Booking from "../models/Booking.js";
import Show from "../models/Show.js"

const checkSeatAvailability=async(showId, selectedSeats)=>{
    try {
        const showData = await Show.findById(showId)
        if(!showData) {
            return false;
        }

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat=>occupiedSeats[seat]);

        return !isAnySeatTaken;
    } catch (error) {
        console.log("Error in deciding booked seats",error.message)
    }
}

// Creating booking data

export const createBooking =async(req,res)=>{
    try {
        const {userId}=req.auth();
        const {showId, selectedSeats}=req.body;

        const {origin} = req.headers;

        // Check seats

        const isAvialable =await checkSeatAvailability(showId,selectedSeats);

        if(!isAvialable) {

            return res.json({success:false,message:"Selected seats are not available"});
        }

        const showData=await Show.findById(showId).populate('movie');

        const booking = await Booking.create({
            user:userId,
            show:showId,
            amount:showData.showPrice * selectedSeats.length,
            bookedSeats:selectedSeats
        })
        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat]=userId;
        })
        // We are saying mongoose to save occupiedSeats data as it has been modified (we are modifieying nested structure without replacing it)
        // markMofied is only for nested objects / array

        showData.markModified('occupiedSeats');

        await showData.save();

        // Stripe gateway

        res.json({success:true,message:"Booked successfully"})

    } catch (error) {
        console.log("Error in create booking section",error.message)
        res.json({success:false,message:error.message})
    }
}



export const getOccupiedSeats = async(req,res)=>{
    try {
        
        const {showId} = req.params;

        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats);

        res.json({success:true,occupiedSeats});

    } catch (error) {
        console.log("Error in fetching occupied seats",error.message)
        res.json({success:false,message:error.message})
    }
}