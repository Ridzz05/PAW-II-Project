
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Ticket,
  CalendarDays,
  Clock,
  MapPin,
  Armchair,
  RefreshCw,
  CreditCard,
  Printer,
  Building2,
} from "lucide-react";
import api from "../services/api";
import "./MyTickets.css";

// Membuat QR Code dekoratif yang konsisten untuk setiap tiket.
const createDecorativeQRValue = (seed) => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const text = String(seed || "CINOVERSE");
  let number = 0;

  for (let i = 0; i < text.length; i++) {
    number =
      (number * 31 + text.charCodeAt(i)) >>> 0;
  }

  let result = "CINO-";

  for (let i = 0; i < 20; i++) {
    number = (number * 1664525 + 1013904223) >>> 0;
    result += characters[number % characters.length];
  }

  return result;
};

export default function MyTickets() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

  // Melanjutkan pembayaran booking yang masih pending.
  const handleContinuePayment = (booking) => {
    const showtimeId = booking.showtimeId?._id;

    if (!showtimeId) {
      setError(
        "Jadwal tayang tidak ditemukan. Silakan hubungi administrator."
      );
      return;
    }

    navigate(`/booking/${showtimeId}`, {
      state: {
        bookingId: booking._id,
        bookingCode: booking.bookingCode,
        seats: booking.seats,
        totalPrice: booking.totalPrice,
        paymentMethod: booking.paymentMethod,
        continuePayment: true,
      },
    });
  };

  // Mencetak hanya tiket yang tombolnya diklik.
  const handlePrint = (bookingId) => {
    const ticketCards = document.querySelectorAll(".ticket-card");

    ticketCards.forEach((card) => {
      card.classList.toggle(
        "printing-ticket",
        card.dataset.bookingId === String(bookingId)
      );
    });

    const cleanupPrint = () => {
      ticketCards.forEach((card) => {
        card.classList.remove("printing-ticket");
      });

      window.removeEventListener("afterprint", cleanupPrint);
    };

    window.addEventListener("afterprint", cleanupPrint);

    window.print();
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(
      date.length === 10 ? `${date}T00:00:00` : date
    );

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
    <div className="container py-5 booking-page my-tickets-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 no-print">
        <div>
          <span className="section-label">YOUR TICKETS</span>

          <h1 className="text-white mt-2">
            Riwayat Tiket
          </h1>

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
        <div className="alert alert-danger no-print">
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
        <div className="card booking-summary-card text-center no-print">
          <div className="card-body py-5">
            <Ticket
              size={48}
              className="text-secondary mb-3"
            />

            <h4 className="text-white">
              Belum Ada Tiket
            </h4>

            <p className="text-secondary">
              Kamu belum melakukan pemesanan tiket film.
            </p>

            <Link
              to="/movies"
              className="btn btn-cinema mt-2"
            >
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
          const isPaid = booking.paymentStatus === "paid";

          const qrValue = createDecorativeQRValue(
            booking._id || booking.bookingCode
          );

          return (
            <div className="col-12" key={booking._id}>
              <div
                className="card booking-summary-card ticket-card"
                data-booking-id={booking._id}
              >
                <div className="card-body p-4">
                  {/* Bagian utama tiket */}
                  <div className="ticket-header d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                    <div className="d-flex align-items-center gap-3">
                      {movie?.posterUrl && (
                        <img
                          src={movie.posterUrl}
                          alt={movie?.title || "Poster film"}
                          className="ticket-poster"
                        />
                      )}

                      <div>
                        <span className="section-label">
                          CINOVERSE E-TICKET
                        </span>

                        <h4 className="text-white mt-2 mb-1">
                          {movie?.title || "Film tidak tersedia"}
                        </h4>

                        <small className="text-secondary">
                          Kode Booking: {booking.bookingCode || "-"}
                        </small>
                      </div>
                    </div>

                    <span
                      className={`ticket-status ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <hr className="border-secondary" />

                  {/* Informasi jadwal */}
                  <div className="row g-4 ticket-main-info">
                    <div className="col-md-6">
                      <p className="ticket-info-label">
                        <MapPin size={16} />
                        Bioskop
                      </p>

                      <p className="text-white mb-1">
                        {cinema?.name || "-"}
                        {cinema?.city ? ` - ${cinema.city}` : ""}
                      </p>

                      <small className="text-secondary">
                        {cinema?.address || "-"}
                      </small>
                    </div>

                    <div className="col-md-6">
                      <p className="ticket-info-label">
                        <CalendarDays size={16} />
                        Tanggal Tayang
                      </p>

                      <p className="text-white mb-0">
                        {formatDate(showtime?.date)}
                      </p>
                    </div>

                    <div className="col-md-6">
                      <p className="ticket-info-label">
                        <Clock size={16} />
                        Waktu Tayang
                      </p>

                      <p className="text-white mb-0">
                        {showtime?.time || "-"}
                      </p>
                    </div>

                    <div className="col-md-6">
                      <p className="ticket-info-label">
                        <Building2 size={16} />
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
                      <p className="ticket-info-label">
                        <Armchair size={16} />
                        Nomor Kursi
                      </p>

                      <p className="text-white mb-0">
                        {booking.seats?.join(", ") || "-"}
                      </p>
                    </div>

                    <div className="col-md-6">
                      <p className="ticket-info-label">
                        <Ticket size={16} />
                        Jumlah Tiket
                      </p>

                      <p className="text-white mb-0">
                        {booking.seats?.length || 0} Tiket
                      </p>
                    </div>
                  </div>

                  {/* QR Code dekoratif hanya untuk tiket lunas */}
                  {isPaid && (
                    <>
                      <div className="ticket-qr-section">
                        <div className="ticket-qr-box">
                          <QRCodeSVG
                            value={qrValue}
                            size={150}
                            level="M"
                            bgColor="#ffffff"
                            fgColor="#111111"
                          />
                        </div>

                        <p className="text-white fw-semibold mt-3 mb-1">
                          CINOVERSE DIGITAL TICKET
                        </p>

                        <small className="text-secondary">
                          QR Code dekoratif
                        </small>
                      </div>

                      <div className="ticket-detail-section">
                        <div className="ticket-detail-heading">
                          DETAIL PEMESANAN
                        </div>

                        <div className="row g-3">
                          <div className="col-sm-6">
                            <small className="text-secondary">
                              Kode Booking
                            </small>
                            <p className="text-white mb-0">
                              {booking.bookingCode || "-"}
                            </p>
                          </div>

                          <div className="col-sm-6">
                            <small className="text-secondary">
                              Film
                            </small>
                            <p className="text-white mb-0">
                              {movie?.title || "-"}
                            </p>
                          </div>

                          <div className="col-sm-6">
                            <small className="text-secondary">
                              Bioskop
                            </small>
                            <p className="text-white mb-0">
                              {cinema?.name || "-"}
                            </p>
                          </div>

                          <div className="col-sm-6">
                            <small className="text-secondary">
                              Alamat Bioskop
                            </small>
                            <p className="text-white mb-0">
                              {cinema?.address || "-"}
                            </p>
                          </div>

                          <div className="col-sm-6">
                            <small className="text-secondary">
                              Metode Pembayaran
                            </small>
                            <p className="text-white mb-0">
                              {booking.paymentMethod || "-"}
                            </p>
                          </div>

                          <div className="col-sm-6">
                            <small className="text-secondary">
                              Tanggal Pembayaran
                            </small>
                            <p className="text-white mb-0">
                              {formatDateTime(booking.paidAt)}
                            </p>
                          </div>

                          <div className="col-sm-6">
                            <small className="text-secondary">
                              Status Pembayaran
                            </small>
                            <p className="text-success mb-0">
                              Lunas
                            </p>
                          </div>

                          <div className="col-sm-6">
                            <small className="text-secondary">
                              Total Pembayaran
                            </small>
                            <p className="text-white fw-bold mb-0">
                              {formatPrice(booking.totalPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Ringkasan pembayaran */}
                  <hr className="border-secondary" />

                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                      <small className="text-secondary">
                        Total Pembayaran
                      </small>

                      <h4 className="text-white mb-0">
                        {formatPrice(booking.totalPrice)}
                      </h4>
                    </div>

                    <div className="no-print">
                      {booking.paymentStatus === "pending" && (
                        <div className="text-end">
                          <p className="text-warning small mb-2">
                            Menunggu proses pembayaran
                          </p>

                          <button
                            type="button"
                            className="btn btn-cinema"
                            onClick={() =>
                              handleContinuePayment(booking)
                            }
                          >
                            <CreditCard
                              size={17}
                              className="me-2"
                            />
                            Lanjutkan Pembayaran
                          </button>
                        </div>
                      )}

                      {isPaid && (
                        <button
                          type="button"
                          className="btn btn-outline-light"
                          onClick={() => handlePrint(booking._id)}
                        >
                          <Printer size={17} className="me-2" />
                          Cetak Tiket
                        </button>
                      )}

                      {booking.paymentStatus === "cancelled" && (
                        <span className="text-danger small">
                          Pemesanan telah dibatalkan
                        </span>
                      )}
                    </div>
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
