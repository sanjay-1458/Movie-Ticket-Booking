import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Movies from "./pages/Movies";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favorite from "./pages/Favorite";
import {Toaster} from 'react-hot-toast'
import Footer from "./components/Footer";

function App() {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/movie/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
