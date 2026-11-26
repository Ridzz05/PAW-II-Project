
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Film,
  Armchair,
} from "lucide-react";

import api from "../services/api";

export default function Showtimes() {
  const [searchParams] = useSearchParams();

  // Data dari API
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);

  // Filter
  const [movieId, setMovieId] = useState(
    searchParams.get("movieId") || ""
  );
  const [cinemaId, setCinemaId] = useState("");
  const [date, setDate] = useState("");

  // Status
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState("");

  // Mengambil data film dan bioskop
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);

        const [movieResponse, cinemaResponse] = await Promise.all([
          api.get("/movies", {
            params: { limit: 100 },
          }),
          api.get("/cinemas"),
        ]);

        setMovies(movieResponse.data.data || []);
        setCinemas(cinemaResponse.data.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Gagal mengambil data film dan bioskop."
        );
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // Mengikuti perubahan movieId pada URL
  useEffect(() => {
    const movieFromUrl = searchParams.get("movieId") || "";
    setMovieId(movieFromUrl);
  }, [searchParams]);

  // Mengambil jadwal tayang berdasarkan filter
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/showtimes", {
          params: {
            movieId: movieId || undefined,
            cinemaId: cinemaId || undefined,
            date: date || undefined,
          },
        });

        setShowtimes(response.data.data || []);
      } catch (err) {
        setShowtimes([]);
        setError(
          err.response?.data?.message ||
            "Gagal mengambil jadwal tayang."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId, cinemaId, date]);

  // Format harga rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // Format tanggal Indonesia
  const formatDate = (value) => {
    if (!value) return "-";

    const parsedDate = new Date(`${value}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return parsedDate.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Reset filter
  const resetFilters = () => {
    setMovieId("");
    setCinemaId("");
    setDate("");
  };

  return (
    <div className="container py-5">
      {/* HEADER */}
      <div className="mb-5">
        <span className="section-label">MOVIE SCHEDULE</span>

        <h1 className="text-white mt-2">
          Movie Showtimes
        </h1>

        <p className="text-secondary">
          Temukan jadwal tayang film favoritmu di bioskop
          CINOVERSE.
        </p>
      </div>

      {/* FILTER */}
      <div className="row g-3 mb-4">
        {/* FILTER FILM */}
        <div className="col-md-4">
          <label className="form-label text-white">
            Pilih Film
          </label>

          <select
            className="form-select"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            disabled={loadingOptions}
          >
            <option value="">Semua Film</option>

            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        {/* FILTER BIOSKOP */}
        <div className="col-md-4">
          <label className="form-label text-white">
            Pilih Bioskop
          </label>

          <select
            className="form-select"
            value={cinemaId}
            onChange={(e) => setCinemaId(e.target.value)}
            disabled={loadingOptions}
          >
            <option value="">Semua Bioskop</option>

            {cinemas.map((cinema) => (
              <option key={cinema._id} value={cinema._id}>
                {cinema.name} - {cinema.city}
              </option>
            ))}
          </select>
        </div>

        {/* FILTER TANGGAL */}
        <div className="col-md-4">
          <label className="form-label text-white">
            Pilih Tanggal
          </label>

          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* RESET FILTER */}
      <div className="mb-4">
        <button
          type="button"
          className="btn btn-outline-light btn-sm"
          onClick={resetFilters}
        >
          Reset Filter
        </button>
      </div>

      {/* LOADING */}
      {(loading || loadingOptions) && (
        <div className="text-center py-5">
          <div
            className="spinner-border text-light"
            role="status"
          />

          <p className="text-secondary mt-3">
            Memuat jadwal tayang...
          </p>
        </div>
      )}

      {/* ERROR */}
      {!loading && !loadingOptions && error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* JADWAL KOSONG */}
      {!loading &&
        !loadingOptions &&
        !error &&
        showtimes.length === 0 && (
          <div className="text-center py-5">
            <Film
              size={45}
              className="text-secondary mb-3"
            />

            <h5 className="text-white">
              Jadwal Tidak Ditemukan
            </h5>

            <p className="text-secondary">
              Belum ada jadwal yang sesuai dengan pilihanmu.
              Silakan ubah filter film, bioskop, atau tanggal.
            </p>
          </div>
        )}

      {/* DAFTAR JADWAL */}
      {!loading && !loadingOptions && !error && (
        <div className="row g-4">
          {showtimes.map((showtime) => {
            const movie = showtime.movieId;
            const cinema = showtime.cinemaId;

            const bookedCount = Array.isArray(
              showtime.bookedSeats
            )
              ? showtime.bookedSeats.length
              : 0;

            return (
              <div
                className="col-lg-6"
                key={showtime._id}
              >
                <div className="card showtime-card h-100">
                  <div className="row g-0 h-100">
                    {/* POSTER FILM */}
                    <div className="col-4">
                      <img
                        src={
                          movie?.posterUrl ||
                          "https://placehold.co/400x600/211936/ffffff?text=No+Poster"
                        }
                        alt={movie?.title || "Poster film"}
                        className="showtime-poster"
                      />
                    </div>

                    {/* INFORMASI JADWAL */}
                    <div className="col-8">
                      <div className="card-body d-flex flex-column h-100">
                        <h5 className="text-white fw-bold">
                          {movie?.title ||
                            "Film tidak tersedia"}
                        </h5>

                        <p className="small text-secondary mb-3">
                          {Array.isArray(movie?.genre)
                            ? movie.genre.join(", ")
                            : movie?.genre || "-"}

                          {movie?.duration
                            ? ` • ${movie.duration} menit`
                            : ""}
                        </p>

                        <div className="showtime-info">
                          <p>
                            <MapPin size={16} />

                            <span>
                              {cinema?.name ||
                                "Bioskop tidak tersedia"}

                              {cinema?.city
                                ? `, ${cinema.city}`
                                : ""}
                            </span>
                          </p>

                          <p>
                            <CalendarDays size={16} />

                            <span>
                              {formatDate(showtime.date)}
                            </span>
                          </p>

                          <p>
                            <Clock size={16} />

                            <span>{showtime.time}</span>
                          </p>

                          <p>
                            <Ticket size={16} />

                            <span>
                              {showtime.studioName} (
                              {showtime.studioType})
                            </span>
                          </p>
                        </div>

                        {/* HARGA DAN JUMLAH KURSI */}
                        <div className="showtime-footer mt-auto">
                          <strong>
                            {formatPrice(showtime.price)}
                          </strong>

                          <span className="small text-secondary">
                            {bookedCount} kursi dipesan
                          </span>
                        </div>

                        {/* TOMBOL PILIH KURSI */}
                        <div className="mt-3">
                          <Link
                            to={`/booking/${showtime._id}`}
                            className="btn btn-cinema w-100"
                          >
                            <Armchair
                              size={17}
                              className="me-2"
                            />

                            Pilih Kursi
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
