import { useEffect, useState } from "react";

import Loading from "../../components/Loading/Loading";
import Title from "./Title";
import BlurCircle from "../../components/BlurCircle/BlurCircle";
import dateFormat from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import type Booking from "../../types/booking";
import toast from "react-hot-toast";

interface ListBookingSuccess {
  success: true;
  bookings: Booking[];
}

interface ListBookingError {
  success: false;
  message: string;
}

type ListBookingAPIResponse = ListBookingSuccess | ListBookingError;

function ListBookings() {
  const { axios, getToken, user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllBookings = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get<ListBookingAPIResponse>(
          "/api/admin/all-bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (data.success) {
          setBookings(data.bookings);
        } else {
          toast.error("Failed to fetch bookings");
        }
      } catch (error) {
        console.log("Error in fetchng all booking data", error);
      }

      setIsLoading(false);
    };
    if (user) {
      getAllBookings();
    }
  }, [user]);

  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="relative">
        <BlurCircle top="-10px" left="40px" />
      </div>
      <div
        className="max-w-4xl mt-6 overflow-x-auto
      no-scrollbar"
      >
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap ">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>

              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {bookings.map((data, index) => {
              return (
                <tr key={index} className="border-b border-primary/20">
                  <td className="p-2 min-w-45 pl-5">{data.user.name}</td>
                  <td className="p-2">{data.show.movie.title}</td>
                  <td className="p-2">{dateFormat(data.show.showDateTime)}</td>
                  <td className="p-2">{data.bookedSeats.join(", ")}</td>
                  <td className="p-2">{currency + data.amount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
}

export default ListBookings;
