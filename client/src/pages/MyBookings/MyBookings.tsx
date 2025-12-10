import { useEffect, useState } from "react";

import Loading from "../../components/Loading/Loading";
import BlurCircle from "../../components/BlurCircle/BlurCircle";
import timeFormat from "../../lib/timeFormat";
import dateFormat from "../../lib/dateFormat";
import type Booking from "../../types/booking";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

interface MyBookingsSuccess {
  success: true;
  bookings: Booking[];
}

interface MyBookingsError {
  success: false;
  message: string;
}

type MyBookingsAPIResponse = MyBookingsError | MyBookingsSuccess;

function MyBookings() {
  const currency: string = import.meta.env.VITE_CURRENCY;
  const { axios, image_base_url, user, getToken } = useAppContext();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const getMyBookings = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get<MyBookingsAPIResponse>(
          "/api/user/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.success) {
          setBookings(data.bookings);
        } else {
          toast.error("Error in fetching my bookings");
        }
      } catch (error) {
        console.log("Error in fetching my bookings", error);
      }
      setIsLoading(false);
    };
    if (user) {
      getMyBookings();
    }
  }, [user]);

  return !isloading ? (
    <div
      className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-screen

    "
    >
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className="text-lg font-semibold mb-4">My Bookings</h1>
      {bookings.map((item, index) => {
        return (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between bg-primary/8 border-primary/20 border rounded-lg mt-4 p-2 max-w-3xl
          max-md:w-full
          
          "
          >
            <div className="flex flex-col md:flex-row">
              <img
                src={image_base_url + item.show.movie.poster_path}
                alt="Movie Poster"
                className="md:max-w-40
              max-w-30 aspect-video h-auto object-cover object-bottom rounded"
              />
              <div className="flex flex-col p-4">
                <p className="text-lg font-semibold">{item.show.movie.title}</p>
                <p className="text-gray-400 text-sm">
                  {timeFormat(item.show.movie.runtime)}
                </p>

                <p className="text-gray-400 text-sm pt-4">
                  {dateFormat(item.show.showDateTime)}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:items-end md:text-right justify-between p-4">
              <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold mb-3">
                  {currency}
                  {item.amount}
                </p>

                {!item.isPaid ? (
                  <Link
                    to={"" + item.paymentLink}
                    className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium hover:bg-primary/90 transition cursor-pointer inline-flex items-center whitespace-nowrap"
                  >
                    Pay Now
                  </Link>
                ) : (
                  <button className="bg-primary/30 px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer">
                    Paid
                  </button>
                )}
              </div>
              <div className="text-sm">
                <p className="">
                  <span className="text-gray-400 mr-1">Total Tickets:</span>
                  {item.bookedSeats.length}
                </p>
                <p>
                  <span className="text-gray-400 mr-1">Seat Numbers:</span>

                  {item.bookedSeats.join(", ")}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <Loading />
  );
}

export default MyBookings;
