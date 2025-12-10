import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../../assets/assets";

import Loading from "../../components/Loading/Loading";
import { ArrowRight, Clock } from "lucide-react";
import ISOTimeFormat from "../../lib/ISOTimeFormat";
import BlurCircle from "../../components/BlurCircle/BlurCircle";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import type Movie from "../../types/movie";

interface DateTime {
  [date: string]: { time: string; showId: string }[];
}
interface SeatLayoutSuccess {
  success: true;
  movie: Movie;
  dateTime: DateTime;
}

interface SeatLayoutError {
  success: false;
  message: string;
}

type SeatLayoutAPIResponse = SeatLayoutError | SeatLayoutSuccess;

interface GetOccupiedSeatsSuccess {
  success: true;
  occupiedSeats: string[];
}
interface GetOccupiedSeatsError {
  success: false;
  message: string;
}

type GetOccupiedSeatsAPIResponse =
  | GetOccupiedSeatsSuccess
  | GetOccupiedSeatsError;

function SeatLayout() {
  const { id, date } = useParams();
  const { axios, getToken, user } = useAppContext();
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const [selectedTime, setSelectedTime] = useState<{
    time: string;
    showId: string;
  } | null>(null);

  const [show, setShow] = useState<Omit<SeatLayoutSuccess, "success"> | null>(
    null
  );

  const navigate = useNavigate();

  const groupRows: string[][] = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const handleSeatClick = (seatId: string) => {
    if (!selectedTime) {
      return toast("Plese select time first");
    }

    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast("You can only select 5 seats");
    }
    if (occupiedSeats.includes(seatId)) {
      return toast.error("This seat is already occupied");
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row: string, col = 9) => {
    return (
      <div key={row} className="flex gap-2 mt-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: col }, (_, i) => {
            const seatId = `${row}${i + 1}`;
            // {
            //   console.log("occupied seats:", occupiedSeats);
            // }
            // {
            //   console.log("current seat:", seatId);
            // }

            return (
              <button
                key={seatId}
                onClick={() => {
                  handleSeatClick(seatId);
                }}
                className={`${
                  occupiedSeats.includes(seatId) ? "opacity-50" : ""
                } 
                  h-8 w-8 rounded border border-primary/60 cursor-pointer ${
                    selectedSeats.includes(seatId) && "bg-primary text-white"
                  }`}
              >
                {seatId}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const bookTickets = async () => {
    try {
      if (!user) {
        return toast.error("Please login to book a show");
      }
      if (!selectedTime || !selectedSeats.length) {
        return toast.error("Please select seat and time to proceed");
      }
      const token = await getToken();
      const { data } = await axios.post(
        "/api/booking/create",
        {
          showId: selectedTime.showId,
          selectedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error in boooking tickets", error);
    }
  };
  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats();
    }
  }, [selectedTime]);
  const getOccupiedSeats = async () => {
    try {
      if (!selectedTime) {
        return toast.error("Please select a time")
      }
      const { data } = await axios.get<GetOccupiedSeatsAPIResponse>(
        `/api/booking/seats/${selectedTime.showId}`
      );

      if (data.success) {
        setOccupiedSeats(data.occupiedSeats);
      } else {
        toast.error("Falied to load booked seats");
      }
    } catch (error) {
      console.log("Error in fetching occupied seats data", error);
    }
  };

  useEffect(() => {
    const getShow = async () => {
      try {
        const { data } = await axios.get<SeatLayoutAPIResponse>(
          `/api/show/${id}`
        );
        if (data.success) {
          setShow({ movie: data.movie, dateTime: data.dateTime });
        } else {
          toast.error("Error in fetching show data");
        }
      } catch (error) {
        console.log("Error in seat layout section", error);
      }
    };
    getShow();
  }, [id]);

  if (!id || !date) {
    return <Loading />;
  }

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      <div
        className="bg-primary/10 border-primary/20
      w-60 border rounded-lg py-10 h-max
      md:sticky md:top-30
      mr-1
      "
      >
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {show.dateTime[date].map((item) => {
            return (
              <div
                onClick={() => {
                  console.log(item.showId, item.time);
                  setSelectedTime({
                    showId: item.showId,
                    time: item.time,
                  });
                }}
                className={`flex items-center gap-2 px-6 py-2 w-max
                  
                  
                  rounded-r-md cursor-pointer transition ${
                    selectedTime?.time === item.time
                      ? " hover:bg-primary bg-primary text-white"
                      : "hover:bg-primary/20"
                  }`}
                key={item.showId}
              >
                <Clock className="w-4 h-4" />
                <p className="text-sm">{ISOTimeFormat(item.time)}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="-100px" right="0px" />
        <h1 className="text-2xl font-semibold mb-4">Select Your Seats</h1>
        <img src={assets.screenImage} alt="Screen" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

        <div className="flex flex-col items-center mt-10 text-xs text-gray-300 gap-6">
          <div className="">{groupRows[0].map((row) => renderSeats(row))}</div>

          <div className="grid grid-cols-2 gap-6">
            {groupRows.slice(1).map((group, ind) => {
              return (
                <div key={ind}>{group.map((row) => renderSeats(row, 6))}</div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            bookTickets();
          }}
          className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary/70
        hover:-translate-y-1 transition rounded-full font-medium cursor-pointer active:scale-95"
        >
          Proceed to checkout
          <ArrowRight className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default SeatLayout;
