import { useEffect, useState } from "react";

import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  Star,
  UsersIcon,
} from "lucide-react";
import Loading from "../../components/Loading/Loading";
import Title from "./Title";
import BlurCircle from "../../components/BlurCircle/BlurCircle";
import dateFormat from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import type Show from "../../types/show";
import toast from "react-hot-toast";

interface DashboardDataType {
  totalBookings: number;
  totalRevenue: number;
  activeShows: Show[];
  totalUser: number;
}
interface DashboardError {
  success: false;
  message: string;
}
interface DashboardSuccess {
  success: true;
  dashBoardData: DashboardDataType;
}
type DashBoardAPIResponse = DashboardSuccess | DashboardError;

function Dashboard() {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;
  const [dashboardData, setDashboardData] = useState<DashboardDataType>({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });
  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || 0,
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: currency + dashboardData.totalRevenue || 0,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Movies",
      value: dashboardData.activeShows.length || 0,
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || 0,
      icon: UsersIcon,
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get<DashBoardAPIResponse>(
          "/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setDashboardData(data.dashBoardData);
          setLoading(false);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error fetching dashboard data");
        console.error("Error fetching dashboard data:", error);
      }

      setLoading(false);
    };
    if (user) {
      fetchDashboardData();
    }
  }, [user]);
  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />
      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top="-100px" left="0" />
        <div className="gap-4 flex flex-wrap w-full">
          {dashboardCards.map((card, index) => {
            return (
              <div
                className="flex items-center justify-between border px-4 py-3 bg-primary/10 border-primary/20 rounded-md max-w-50 w-full"
                key={index}
              >
                <div>
                  <h1 className="text-sm">{card.title}</h1>
                  <p className="text-xl font-medium mt-1">{card.value}</p>
                </div>
                <card.icon className="w-6 h-6" />
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-10 text-lg font-medium">Active Movies</p>

      <div className="mt-4 relative flex flex-wrap gap-6 max-w-5xl">
        <BlurCircle top="-100px" left="-10%" />
        {dashboardData.activeShows.map((show) => (
          <div
            className="border border-primary/20 w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 hover:-translate-y-1 transition duration-300"
            key={show._id}
          >
            <img
              src={image_base_url + show.movie.poster_path}
              className="h-60 w-full object-cover"
            />
            <p className="font-medium p-2 truncate">{show.movie.title}</p>
            <div className="flex items-center justify-between px-2">
              <p className="text-lg font-medium">
                {currency}
                {show.showPrice}
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                <Star className="w-4 h-4 text-primary fill-primary" />
                {show.movie.vote_average.toFixed(1)}
              </p>
            </div>
            <p className="px-2 pt-2 text-sm text-gray-500">
              {dateFormat(show.showDateTime)}
            </p>
          </div>
        ))}
      </div>
    </>
  ) : (
    <Loading />
  );
}

export default Dashboard;
