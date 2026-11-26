
import { useEffect, useMemo, useState } from "react";
import {
  Ticket,
  Search,
  Eye,
  X,
  CalendarDays,
  MapPin,
  Armchair,
} from "lucide-react";
import api from "../../services/api";

function getStatusLabel(status) {
  const labels = {
    pending: "Menunggu Pembayaran",
    paid: "Lunas",
    cancelled: "Dibatalkan",
  };

  return labels[status] || status || "Tidak diketahui";
}

function getStatusClass(status) {
  const classes = {
    pending: "bg-warning text-dark",
    paid: "bg-success",
    cancelled: "bg-danger",
  };

  return classes[status] || "bg-secondary";
}

function formatCurrency(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function getUserName(booking) {
  const user = booking.userId || booking.user;

  return (
    user?.name ||
    user?.nama ||
    user?.username ||
    user?.email ||
    "Pengguna"
  );
}

function getMovie(booking) {
  const showtime = booking.showtimeId || booking.showtime;
  return showtime?.movieId || showtime?.movie || {};
}

function getCinema(booking) {
  const showtime = booking.showtimeId || booking.showtime;
  return showtime?.cinemaId || showtime?.cinema || {};
}

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings");

      setBookings(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Gagal mengambil data pemesanan tiket."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const movie = getMovie(booking);
      const userName = getUserName(booking);
      const bookingCode =
        booking.bookingCode || booking.code || booking._id || "";

      const matchesSearch = [
        userName,
        movie.title,
        bookingCode,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        booking.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const openDetail = (booking) => {
    setSelectedBooking(booking);
  };

  const closeDetail = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="container py-5 admin-bookings-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <Ticket size={25} />
            <span className="text-secondary">CINOVERSE ADMIN</span>
          </div>

          <h2 className="fw-bold">Kelola Pemesanan Tiket</h2>

          <p className="text-secondary mb-0">
            Lihat dan pantau seluruh transaksi pemesanan tiket.
          </p>
        </div>

        <button
          className="btn btn-outline-light"
          onClick={fetchBookings}
          disabled={loading}
        >
          {loading ? "Memuat..." : "Muat Ulang"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="booking-stat-card">
            <p>Total Pemesanan</p>
            <h3>{bookings.length}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="booking-stat-card">
            <p>Menunggu Pembayaran</p>
            <h3>
              {bookings.filter((item) => item.paymentStatus === "pending").length}
            </h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="booking-stat-card">
            <p>Pemesanan Lunas</p>
            <h3>
              {bookings.filter((item) => item.paymentStatus === "paid").length}
            </h3>
          </div>
        </div>
      </div>

      <div className="admin-booking-toolbar mb-4">
        <div className="booking-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Cari kode booking, pengguna, atau film..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Semua Status</option>
          <option value="pending">Menunggu Pembayaran</option>
          <option value="paid">Lunas</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>

      <div className="admin-table-card">
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Kode Booking</th>
                <th>Pengguna</th>
                <th>Film</th>
                <th>Kursi</th>
                <th>Total Harga</th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>

            <tbody>
              {loading && bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Memuat data pemesanan...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Tidak ada data pemesanan yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const movie = getMovie(booking);
                  const seats = Array.isArray(booking.seats)
                    ? booking.seats
                    : [];

                  return (
                    <tr key={booking._id}>
                      <td className="fw-semibold">
                        {booking.bookingCode ||
                          booking.code ||
                          booking._id}
                      </td>

                      <td>{getUserName(booking)}</td>

                      <td>{movie.title || "Film tidak ditemukan"}</td>

                      <td>
                        {seats.length
                          ? seats.join(", ")
                          : "-"}
                      </td>

                      <td>{formatCurrency(booking.totalPrice)}</td>

                      <td>
                        <span
                          className={`badge ${getStatusClass(
                            booking.paymentStatus
                          )}`}
                        >
                          {getStatusLabel(booking.paymentStatus)}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline-info"
                          title="Lihat detail"
                          onClick={() => openDetail(booking)}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <div
          className="admin-booking-modal-backdrop"
          onClick={closeDetail}
        >
          <div
            className="admin-booking-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <p className="text-secondary mb-1">
                  DETAIL PEMESANAN
                </p>
                <h4 className="fw-bold mb-0">E-Ticket Booking</h4>
              </div>

              <button
                className="btn btn-outline-light btn-sm"
                onClick={closeDetail}
              >
                <X size={18} />
              </button>
            </div>

            {(() => {
              const movie = getMovie(selectedBooking);
              const cinema = getCinema(selectedBooking);
              const showtime =
                selectedBooking.showtimeId ||
                selectedBooking.showtime ||
                {};

              const seats = Array.isArray(selectedBooking.seats)
                ? selectedBooking.seats
                : [];

              return (
                <>
                  <div className="booking-ticket-code mb-4">
                    <span>Kode Booking</span>
                    <h5 className="fw-bold mb-0">
                      {selectedBooking.bookingCode ||
                        selectedBooking.code ||
                        selectedBooking._id}
                    </h5>
                  </div>

                  <div className="booking-detail-row">
                    <span>Nama Pengguna</span>
                    <strong>{getUserName(selectedBooking)}</strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>Film</span>
                    <strong>{movie.title || "-"}</strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>Bioskop</span>
                    <strong>{cinema.name || "-"}</strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>Studio</span>
                    <strong>
                      {showtime.studioName || "-"}
                    </strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>
                      <CalendarDays size={15} className="me-1" />
                      Tanggal
                    </span>
                    <strong>{showtime.date || "-"}</strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>Jam Tayang</span>
                    <strong>{showtime.time || "-"}</strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>
                      <Armchair size={15} className="me-1" />
                      Nomor Kursi
                    </span>
                    <strong>{seats.join(", ") || "-"}</strong>
                  </div>

                  <div className="booking-detail-row">
                    <span>
                      <MapPin size={15} className="me-1" />
                      Kota
                    </span>
                    <strong>{cinema.city || "-"}</strong>
                  </div>

                  <div className="booking-detail-total mt-3">
                    <span>Total Pembayaran</span>
                    <h4 className="fw-bold mb-0">
                      {formatCurrency(selectedBooking.totalPrice)}
                    </h4>
                  </div>

                  <div className="booking-detail-row mt-3">
                    <span>Status</span>
                    <span
                      className={`badge ${getStatusClass(
                        selectedBooking.paymentStatus
                      )}`}
                    >
                      {getStatusLabel(selectedBooking.paymentStatus)}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookings;
