
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Armchair, ArrowLeft, Ticket } from "lucide-react";
import api from "../services/api";

export default function Booking() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Data yang dikirim dari halaman Riwayat Tiket
  const resumeData = location.state;
  const resumeRequested = Boolean(
    resumeData?.continuePayment && resumeData?.bookingId
  );

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("virtual_account");
  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentLoadFailed, setPaymentLoadFailed] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Mengambil jadwal dan booking lama jika melanjutkan pembayaran
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        setPaymentLoadFailed(false);

        // Ambil detail jadwal tayang
        const showtimeResponse = await api.get(
          `/showtimes/${showtimeId}`
        );

        setShowtime(showtimeResponse.data.data);

        // Jika berasal dari tombol Lanjutkan Pembayaran
        if (resumeRequested) {
          try {
            const bookingResponse = await api.get(
              `/bookings/${resumeData.bookingId}`
            );

            const existingBooking = bookingResponse.data.data;

            if (!existingBooking) {
              throw new Error("Data booking tidak ditemukan.");
            }

            // Pastikan booking masih menunggu pembayaran
            if (existingBooking.paymentStatus !== "pending") {
              setError(
                existingBooking.paymentStatus === "paid"
                  ? "Booking ini sudah dibayar."
                  : "Booking ini sudah dibatalkan dan tidak dapat dibayar."
              );

              setPaymentLoadFailed(true);
              return;
            }

            // Pastikan booking sesuai dengan jadwal yang dibuka
            const existingShowtimeId =
              existingBooking.showtimeId?._id ||
              existingBooking.showtimeId;

            if (
              String(existingShowtimeId) !== String(showtimeId)
            ) {
              throw new Error(
                "Jadwal booking tidak sesuai."
              );
            }

            // Gunakan booking lama, bukan membuat booking baru
            setBooking(existingBooking);
            setSelectedSeats(existingBooking.seats || []);

            setPaymentMethod(
              existingBooking.paymentMethod || "virtual_account"
            );

            setMessage(
              "Booking sebelumnya berhasil ditemukan. Silakan lanjutkan pembayaran."
            );
          } catch (err) {
            setPaymentLoadFailed(true);

            setError(
              err.response?.data?.message ||
              err.message ||
              "Gagal mengambil data booking sebelumnya."
            );
          }
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Gagal mengambil detail jadwal tayang."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showtimeId, resumeRequested, resumeData?.bookingId]);

  const movie = showtime?.movieId;
  const cinema = showtime?.cinemaId;

  const studio = cinema?.studios?.find(
    (item) => item.name === showtime?.studioName
  );

  const rows = Number(studio?.rows || 0);
  const cols = Number(studio?.cols || 0);

  const bookedSeats = showtime?.bookedSeats || [];

  const seats = useMemo(() => {
    const result = [];

    for (let row = 0; row < rows; row++) {
      const rowLabel = String.fromCharCode(65 + row);

      for (let col = 1; col <= cols; col++) {
        result.push(`${rowLabel}${col}`);
      }
    }

    return result;
  }, [rows, cols]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price || 0);

  // Jika booking lama sedang dilanjutkan, gunakan total harga booking tersebut
  const totalPrice = booking
    ? booking.totalPrice
    : selectedSeats.length * (showtime?.price || 0);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat) || booking) return;

    setSelectedSeats((previous) =>
      previous.includes(seat)
        ? previous.filter((item) => item !== seat)
        : [...previous, seat]
    );
  };

  // Membuat booking baru
  const createBooking = async () => {
    if (selectedSeats.length === 0) {
      setError("Silakan pilih minimal satu kursi.");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setMessage("");

      const response = await api.post("/bookings", {
        showtimeId,
        seats: selectedSeats,
        paymentMethod,
      });

      setBooking(response.data.data);
      setMessage(
        "Pemesanan berhasil. Silakan lanjutkan pembayaran."
      );

      // Perbarui status kursi dari server
      try {
        const latest = await api.get(
          `/showtimes/${showtimeId}`
        );

        setShowtime(latest.data.data);
      } catch {
        // Booking tetap tersimpan jika refresh jadwal gagal
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Pemesanan gagal. Silakan coba kembali."
      );

      // Perbarui status kursi dari server
      try {
        const latest = await api.get(
          `/showtimes/${showtimeId}`
        );

        setShowtime(latest.data.data);
      } catch {
        // Pesan kesalahan awal tetap ditampilkan
      }
    } finally {
      setProcessing(false);
    }
  };

  // Membayar booking yang sudah ada
  const payBooking = async () => {
    if (!booking?._id) {
      setError("Data booking tidak ditemukan.");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setMessage("");

      await api.put(`/bookings/${booking._id}/pay`, {
        paymentMethod,
      });

      setMessage(
        "Pembayaran berhasil! Tiket kamu sudah siap."
      );

      // Arahkan ke halaman riwayat tiket
      navigate("/riwayat");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Pembayaran gagal. Silakan coba kembali."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-white">
        Memuat informasi jadwal...
      </div>
    );
  }

  if (error && !showtime) {
    return (
      <div className="container py-5 text-center text-white">
        <h4>Jadwal tidak tersedia</h4>

        <p className="text-secondary">{error}</p>

        <button
          className="btn btn-cinema"
          onClick={() => navigate("/showtimes")}
        >
          Kembali ke Showtimes
        </button>
      </div>
    );
  }

  if (!showtime) return null;

  return (
    <div className="container py-5 booking-page">
      <button
        className="btn btn-outline-light mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={17} className="me-2" />
        Kembali
      </button>

      <div className="mb-4">
        <span className="section-label">
          BOOK YOUR TICKET
        </span>

        <h1 className="text-white mt-2">
          {resumeRequested
            ? "Lanjutkan Pembayaran"
            : "Pilih Kursi"}
        </h1>

        <p className="text-secondary">
          {resumeRequested
            ? "Selesaikan pembayaran untuk booking tiket kamu."
            : "Pilih kursi yang tersedia untuk menikmati film favoritmu."}
        </p>
      </div>

      <div className="card booking-summary-card mb-4">
        <div className="card-body">
          <h4 className="text-white">
            {movie?.title}
          </h4>

          <p className="text-secondary mb-1">
            {cinema?.name} - {cinema?.city}
          </p>

          <p className="text-secondary mb-1">
            {showtime.date} | {showtime.time}
          </p>

          <p className="text-secondary mb-0">
            {showtime.studioName} ({showtime.studioType})
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {paymentLoadFailed && (
        <div className="card booking-summary-card">
          <div className="card-body text-center py-4">
            <h5 className="text-white">
              Pembayaran Tidak Dapat Dilanjutkan
            </h5>

            <p className="text-secondary">
              Silakan periksa kembali status booking kamu melalui riwayat tiket.
            </p>

            <button
              className="btn btn-cinema"
              onClick={() => navigate("/riwayat")}
            >
              Kembali ke Riwayat Tiket
            </button>
          </div>
        </div>
      )}

      {!paymentLoadFailed && (
        <>
          {!studio || rows <= 0 || cols <= 0 ? (
            <div className="alert alert-warning">
              Informasi kapasitas studio tidak ditemukan.
              Periksa data studios pada bioskop di MongoDB.
            </div>
          ) : (
            <>
              <div className="card booking-seat-card">
                <div className="card-body">
                  <div className="screen-area">
                    <div className="screen-line" />
                    <span>SCREEN</span>
                  </div>

                  <div className="seat-legend">
                    <span>
                      <i className="seat-sample available" />
                      Tersedia
                    </span>

                    <span>
                      <i className="seat-sample selected" />
                      Dipilih
                    </span>

                    <span>
                      <i className="seat-sample booked" />
                      Dipesan
                    </span>
                  </div>

                  <div className="seat-grid">
                    {seats.map((seat) => {
                      const isBooked =
                        bookedSeats.includes(seat);

                      const isSelected =
                        selectedSeats.includes(seat);

                      return (
                        <button
                          key={seat}
                          type="button"
                          disabled={
                            Boolean(booking) ||
                            (isBooked && !isSelected)
                          }
                          onClick={() => toggleSeat(seat)}
                          className={`seat-button ${
                            isSelected
                              ? "selected"
                              : isBooked
                              ? "booked"
                              : "available"
                          }`}
                          title={seat}
                        >
                          <Armchair size={17} />
                          <small>{seat}</small>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="card booking-summary-card mt-4">
                <div className="card-body">
                  <h5 className="text-white mb-3">
                    Ringkasan Pemesanan
                  </h5>

                  {booking?.bookingCode && (
                    <p className="text-secondary">
                      Kode Booking:{" "}
                      <strong className="text-white">
                        {booking.bookingCode}
                      </strong>
                    </p>
                  )}

                  <p className="text-secondary">
                    Kursi dipilih:{" "}
                    <strong className="text-white">
                      {selectedSeats.length
                        ? selectedSeats.join(", ")
                        : "-"}
                    </strong>
                  </p>

                  <p className="text-secondary">
                    Harga per kursi:{" "}
                    <strong className="text-white">
                      {formatPrice(showtime.price)}
                    </strong>
                  </p>

                  <h4 className="text-white">
                    Total: {formatPrice(totalPrice)}
                  </h4>

                  <label className="form-label text-white mt-3">
                    Metode Pembayaran
                  </label>

                  <select
                    className="form-select mb-3"
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                    disabled={Boolean(booking)}
                  >
                    <option value="virtual_account">
                      Virtual Account
                    </option>

                    <option value="qris">
                      QRIS
                    </option>

                    <option value="transfer">
                      Transfer Bank
                    </option>
                  </select>

                  {!booking ? (
                    <button
                      className="btn btn-cinema w-100"
                      onClick={createBooking}
                      disabled={
                        processing ||
                        selectedSeats.length === 0 ||
                        resumeRequested
                      }
                    >
                      <Ticket size={18} className="me-2" />

                      {processing
                        ? "Memproses..."
                        : "Konfirmasi Pemesanan"}
                    </button>
                  ) : (
                    <button
                      className="btn btn-cinema w-100"
                      onClick={payBooking}
                      disabled={processing}
                    >
                      {processing
                        ? "Memproses pembayaran..."
                        : "Bayar Sekarang"}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
