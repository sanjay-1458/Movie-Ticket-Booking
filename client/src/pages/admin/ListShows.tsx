import { useEffect, useState } from "react";

import Loading from "../../components/Loading/Loading";
import Title from "./Title";
import dateFormat from "../../lib/dateFormat";
import BlurCircle from "../../components/BlurCircle/BlurCircle";
import { useAppContext } from "../../context/AppContext";
import type Show from "../../types/show";
import toast from "react-hot-toast";

interface ListShowsSuccess {
  shows: Show[];
  success: true;
}

interface ListShowsError {
  message: string;
  success: false;
}

type ListShowsDataType = ListShowsError | ListShowsSuccess;

function ListShows() {
  const { axios, getToken, user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllShows = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get<ListShowsDataType>(
          "/api/admin/all-shows",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setShows(data.shows);
        } else {
          toast.error("Error in fetching shows data");
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      getAllShows();
    }
  }, [user]);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />
      <div className="relative">
        <BlurCircle top="-10px" left="40px" />
      </div>
      <div
        className="max-w-4xl mt-6 overflow-x-auto
      no-scrollbar
      "
      >
        <table className="w-full  bordder-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/30 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium ">Show Time</th>
              <th className="p-2 font-medium ">Total Booking</th>
              <th className="p-2 font-medium ">{currency}Earning</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {shows.map((show, index) => {
              return (
                <tr
                  key={index}
                  className="border-b  border-primary/20 bg-primary/5 even:bg-primary/10"
                >
                  <td className="p-2 min-w-45 pl-5">{show.movie.title}</td>
                  <td className="p-2">{dateFormat(show.showDateTime)}</td>
                  <td className="p-2">
                    {Object.keys(show.occupiedSeats).length}
                  </td>
                  <td className="p-2">
                    {show.showPrice * Object.keys(show.occupiedSeats).length}
                  </td>
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

export default ListShows;
