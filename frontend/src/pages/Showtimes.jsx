
import { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin, Ticket, Film } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function Showtimes() {
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [cinemas, setCinemas] = useState([]);

    const [cinemaId, setCinemaId] = useState("");
    const [date, setDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();

    const [movieId, setMovieId] = useState(
        searchParams.get("movieId") || ""
    );


    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [movieResponse, cinemaResponse] = await Promise.all([
                    api.get("/movies", { params: { limit: 100 } }),
                    api.get("/cinemas"),
                ]);

                setMovies(movieResponse.data.data || []);
                setCinemas(cinemaResponse.data.data || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Gagal mengambil data film dan bioskop."
                );
            }
        };

        fetchOptions();
    }, []);

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

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(price || 0);
    };

    const formatDate = (value) => {
        if (!value) return "-";

        return new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="container py-5">
            <div className="mb-5">
                <span className="section-label">MOVIE SCHEDULE</span>
                <h1 className="text-white mt-2">Movie Showtimes</h1>
                <p className="text-secondary">
                    Temukan jadwal tayang film favoritmu di bioskop CINOVERSE.
                </p>
            </div>

            {/* FILTER */}
            <div className="row g-3 mb-5">
                <div className="col-md-4">
                    <label className="form-label text-white">Pilih Film</label>
                    <select
                        className="form-select"
                        value={movieId}
                        onChange={(e) => setMovieId(e.target.value)}
                    >
                        <option value="">Semua Film</option>
                        {movies.map((movie) => (
                            <option key={movie._id} value={movie._id}>
                                {movie.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label text-white">Pilih Bioskop</label>
                    <select
                        className="form-select"
                        value={cinemaId}
                        onChange={(e) => setCinemaId(e.target.value)}
                    >
                        <option value="">Semua Bioskop</option>
                        {cinemas.map((cinema) => (
                            <option key={cinema._id} value={cinema._id}>
                                {cinema.name} - {cinema.city}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label text-white">Pilih Tanggal</label>
                    <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            {/* SHOWTIME LIST */}
            {loading && (
                <p className="text-white">Memuat jadwal tayang...</p>
            )}

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {!loading && !error && showtimes.length === 0 && (
                <div className="text-center py-5">
                    <Film size={42} className="text-secondary mb-3" />
                    <h5 className="text-white">Jadwal tidak ditemukan</h5>
                    <p className="text-secondary">
                        Coba ubah pilihan film, bioskop, atau tanggal.
                    </p>
                </div>
            )}

            <div className="row g-4">
                {showtimes.map((showtime) => {
                    const movie = showtime.movieId;
                    const cinema = showtime.cinemaId;

                    return (
                        <div className="col-lg-6" key={showtime._id}>
                            <div className="card showtime-card h-100">
                                <div className="row g-0 h-100">
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

                                    <div className="col-8">
                                        <div className="card-body">
                                            <h5 className="text-white fw-bold">
                                                {movie?.title || "Film tidak tersedia"}
                                            </h5>

                                            <p className="small text-secondary mb-3">
                                                {Array.isArray(movie?.genre)
                                                    ? movie.genre.join(", ")
                                                    : "-"}
                                                {movie?.duration
                                                    ? ` • ${movie.duration} menit`
                                                    : ""}
                                            </p>

                                            <div className="showtime-info">
                                                <p>
                                                    <MapPin size={16} />
                                                    <span>
                                                        {cinema?.name || "Bioskop tidak tersedia"}
                                                        {cinema?.city ? `, ${cinema.city}` : ""}
                                                    </span>
                                                </p>

                                                <p>
                                                    <CalendarDays size={16} />
                                                    <span>{formatDate(showtime.date)}</span>
                                                </p>

                                                <p>
                                                    <Clock size={16} />
                                                    <span>{showtime.time}</span>
                                                </p>

                                                <p>
                                                    <Ticket size={16} />
                                                    <span>
                                                        {showtime.studioName} ({showtime.studioType})
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="showtime-footer">
                                                <strong>{formatPrice(showtime.price)}</strong>
                                                <span className="small text-secondary">
                                                    {showtime.bookedSeats?.length || 0} kursi dipesan
                                                </span>
                                            </div>
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
