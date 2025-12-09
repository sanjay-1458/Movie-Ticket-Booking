import NavBar from "./components/NavBar/NavBar.tsx";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import Movies from "./pages/Movies/Movies.tsx";
import MovieDetails from "./pages/MovieDetails/MovieDetails.tsx";
import SeatLayout from "./pages/SeatLayout/SeatLayout.tsx";
import MyBookings from "./pages/MyBookings/MyBookings.tsx";
import Favorite from "./pages/Favorite/Favorite.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/admin/Layout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import AddShows from "./pages/admin/AddShows.tsx";
import ListBookings from "./pages/admin/ListBookings.tsx";
import ListShows from "./pages/admin/ListShows.tsx";

import { SignIn } from "@clerk/clerk-react";
import { useAppContext } from "./context/AppContext.tsx";

function App() {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

  const {user} = useAppContext()
  return (
    <>
      <Toaster />
      {!isAdminRoute && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} />

        <Route path="/admin/*" element={user ? <Layout />:(
          <div className="min-h-screen flex justify-center items-center">
            <SignIn fallbackRedirectUrl={'/admin'}/>
          </div>
        )}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
          <Route path="list-shows" element={<ListShows />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
