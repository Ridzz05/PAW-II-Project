
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import Cinemas from "./pages/Cinemas";
import Showtimes from "./pages/Showtimes";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminCinemas from "./pages/admin/AdminCinemas";
import AdminShowtimes from "./pages/admin/AdminShowtimes";
import AdminBookings from "./pages/admin/AdminBookings";
import Booking from "./pages/Booking";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* USER */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/cinemas" element={<Cinemas />} />
        <Route path="/showtimes" element={<Showtimes />} />
        <Route path="/booking/:showtimeId" element={<Booking />} />
        
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/movies" element={<AdminMovies />} />
        <Route path="/admin/cinemas" element={<AdminCinemas />} />
        <Route path="/admin/showtimes" element={<AdminShowtimes />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
      </Routes>
    </>
  );
}

export default App;
