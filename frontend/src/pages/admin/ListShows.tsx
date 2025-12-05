import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import type { Movie } from "../MovieDetails";
import Loading from "../../components/Loading";
import Title from "./Title";
import dateFormat from "../../lib/dateFormat";
import BlurCircle from "../../components/BlurCircle";

export type ListShowsDataType = {
  movie: Movie;
  showDateTime: string;
  showPrice: number;
  occupiedSeats: Record<string, string>;
};

function ListShows() {
  const currency = import.meta.env.VITE_CURRENCY;

  const [shows, setShows] = useState<ListShowsDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      setShows([
        {
          movie: dummyShowsData[0],
          showDateTime: "2025-06-30T02:30:00.000Z",
          showPrice: 59,
          occupiedSeats: {
            A1: "user_1",
            B1: "user_2",
            C1: "user_3",
          },
        },
      ]);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllShows();
  }, []);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />
      <div className="relative">
        <BlurCircle top = "-10px" left="40px"/>
      </div>
      <div className="max-w-4xl mt-6 overflow-x-auto
      no-scrollbar
      ">
        
        <table className="w-full  bordder-collapse rounded-md overflow-hidden text-nowrap">
          <thead >
            <tr className="bg-primary/30 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium ">Show Time</th>
              <th className="p-2 font-medium ">Total Booking</th>
              <th className="p-2 font-medium ">Earning</th>
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
