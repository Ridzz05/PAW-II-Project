
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Ticket,
  CalendarDays,
  Clock,
  MapPin,
  Armchair,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

export default function MyTickets() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/me");
      setBookings(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Gagal mengambil riwayat tiket."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const getStatus = (status) => {
    switch (status) {
      case "paid":
        return {
          label: "Lunas",
          className: "ticket-status-paid",
        };
      case "cancelled":
        return {
          label: "Dibatalkan",
          className: "ticket-status-cancelled",
        };
      default:
        return {
          label: "Menunggu Pembayaran",
          className: "ticket-status-pending",
        };
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-white">
        Memuat riwayat tiket...
      </div>
    );
  }

  return (
    <div className="container py-5 booking-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <span className="section-label">YOUR TICKETS</span>
          <h1 className="text-white mt-2">Riwayat Tiket</h1>
          <p className="text-secondary mb-0">
            Lihat semua pemesanan tiket film kamu di CINOVERSE.
          </p>
        </div>

        <button
          className="btn btn-outline-light"
          onClick={fetchBookings}
        >
          <RefreshCw size={16} className="me-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchBookings}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {!error && bookings.length === 0 && (
        <div className="card booking-summary-card text-center">
          <div className="card-body py-5">
            <Ticket size={48} className="text-secondary mb-3" />
            <h4 className="text-white">
              Belum Ada Tiket
            </h4>
            <p className="text-secondary">
              Kamu belum melakukan pemesanan tiket film.
            </p>
            <Link to="/movies" className="btn btn-cinema mt-2">
              Jelajahi Film
            </Link>
          </div>
        </div>
      )}

      <div className="row g-4">
        {bookings.map((booking) => {
          const showtime = booking.showtimeId;
          const movie = showtime?.movieId;
          const cinema = showtime?.cinemaId;
          const status = getStatus(booking.paymentStatus);

          return (
            <div className="col-12" key={booking._id}>
              <div className="card booking-summary-card ticket-card">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                    <div>
                      <span className="section-label">
                        CINOVERSE E-TICKET
                      </span>
                      <h4 className="text-white mt-2 mb-1">
                        {movie?.title || "Film tidak tersedia"}
                      </h4>
                      <small className="text-secondary">
                        Kode Booking: {booking.bookingCode}
                      </small>
                    </div>

                    <span className={`ticket-status ${status.className}`}>
                      {status.label}
                    </span>
                  </div>

                  <hr className="border-secondary" />

                  <div className="row g-3">
                    <div className="col-md-6">
                      <p className="text-secondary mb-1">
                        <MapPin size={15} className="me-2" />
                        Bioskop
                      </p>
                      <p className="text-white mb-0">
                        {cinema?.name || "-"}
                        {cinema?.city ? ` - ${cinema.city}` : ""}
                      </p>
                      <small className="text-secondary">
                        {cinema?.address || ""}
                      </small>
                    </div>

                    <div className="col-md-6">
                      <p className="text-secondary mb-1">
                        <CalendarDays size={15} className="me-2" />
                        Tanggal
                      </p>
                      <p className="text-white mb-0">
                        {formatDate(showtime?.date)}
                      </p>
                    </div>

                    <div className="col-md-6">
                      <p className="text-secondary mb-1">
                        <Clock size={15} className="me-2" />
                        Waktu
                      </p>
                      <p className="text-white mb-0">
                        {showtime?.time || "-"}
                      </p>
                    </div>

                    <div className="col-md-6">
                      <p className="text-secondary mb-1">
                        <Armchair size={15} className="me-2" />
                        Studio
                      </p>
                      <p className="text-white mb-0">
                        {showtime?.studioName || "-"}
                        {showtime?.studioType
                          ? ` (${showtime.studioType})`
                          : ""}
                      </p>
                    </div>

                    <div className="col-md-6">
                      <p className="text-secondary mb-1">
                        Kursi
                      </p>
                      <p className="text-white mb-0">
                        {booking.seats?.join(", ") || "-"}
                      </p>
                    </div>

                    <div className="col-md-6">
                      <p className="text-secondary mb-1">
                        Metode Pembayaran
                      </p>
                      <p className="text-white mb-0">
                        {booking.paymentMethod || "-"}
                      </p>
                    </div>
                  </div>

                  <hr className="border-secondary" />

                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                      <small className="text-secondary">
                        Total Pembayaran
                      </small>
                      <h4 className="text-white mb-0">
                        {formatPrice(booking.totalPrice)}
                      </h4>
                    </div>

                    {booking.paymentStatus === "pending" && (
                      <span className="text-warning small">
                        Menunggu proses pembayaran
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
