
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import Cinemas from "./pages/Cinemas";
import Showtimes from "./pages/Showtimes";
import Booking from "./pages/Booking";
import MyTickets from "./pages/MyTickets";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminCinemas from "./pages/admin/AdminCinemas";
import AdminShowtimes from "./pages/admin/AdminShowtimes";
import AdminBookings from "./pages/admin/AdminBookings";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* HALAMAN AWAL */}
        <Route path="/" element={<Login />} />

        {/* USER */}
        <Route path="/home" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/cinemas" element={<Cinemas />} />
        <Route path="/showtimes" element={<Showtimes />} />
        <Route path="/booking/:showtimeId" element={<Booking />} />
        <Route path="/riwayat" element={<MyTickets />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="cinemas" element={<AdminCinemas />} />
          <Route path="showtimes" element={<AdminShowtimes />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>

        {/* HALAMAN TIDAK DITEMUKAN */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
