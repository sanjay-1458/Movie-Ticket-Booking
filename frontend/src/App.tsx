import React from "react";
import NavBar from "./components/NavBar/NavBar.tsx";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favorite from "./pages/Favorite";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/admin/Layout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import AddShows from "./pages/admin/AddShows.tsx";
import ListBookings from "./pages/admin/ListBookings.tsx";
import ListShows from "./pages/admin/ListShows.tsx";

function App() {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

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

        <Route path="/admin/*" element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="add-shows"
        element={<AddShows/>}/>
        <Route path="list-bookings"
        element={<ListBookings/>}/>
        <Route path="list-shows"
        element={<ListShows/>}/>
        
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
