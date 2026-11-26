
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Clock,
  Calendar,
  ArrowLeft,
  Film,
} from "lucide-react";
import api from "../services/api";

export default function MovieDetail() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/movies/${id}`);

        setMovie(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Film tidak ditemukan atau gagal mengambil data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center text-white">
        Memuat detail film...
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container py-5 text-center text-white">
        <h2>Movie Not Found</h2>

        <p className="text-secondary">
          {error || "Data film tidak tersedia."}
        </p>

        <Link to="/movies" className="btn btn-cinema mt-3">
          Back to Movies
        </Link>
      </div>
    );
  }

  const releaseDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Belum tersedia";

  return (
    <div className="container movie-detail-section">
      <Link to="/movies" className="back-link">
        <ArrowLeft size={18} /> Back to Movies
      </Link>

      <div className="row g-5 mt-3 align-items-center">
        <div className="col-md-4">
          <img
            src={
              movie.posterUrl ||
              "https://placehold.co/400x600/211936/ffffff?text=No+Poster"
            }
            alt={movie.title}
            className="detail-poster"
          />
        </div>

        <div className="col-md-8">
          <span className="section-label">
            MOVIE DETAILS
          </span>

          <h1 className="detail-title mt-3">
            {movie.title}
          </h1>

          <p className="detail-genre">
            {Array.isArray(movie.genre)
              ? movie.genre.join(" / ")
              : movie.genre}
          </p>

          <div className="detail-meta">
            <span>
              <Star className="star-icon" size={18} />
              {movie.rating ?? 0}/10
            </span>

            <span>
              <Clock size={18} />
              {movie.duration} minutes
            </span>

            <span>
              <Calendar size={18} />
              {releaseDate}
            </span>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-4">
            <span className="badge bg-secondary">
              {movie.ageRating || "13+"}
            </span>

            <span className="badge bg-secondary">
              {movie.language || "Indonesia"}
            </span>

            <span className="badge bg-secondary">
              {movie.status === "now_showing"
                ? "Now Showing"
                : "Coming Soon"}
            </span>
          </div>

          <h5 className="mt-5">Synopsis</h5>

          <p className="detail-description">
            {movie.synopsis}
          </p>

          {movie.status === "now_showing" ? (
            <Link
              to={`/showtimes?movieId=${movie._id}`}
              className="btn btn-cinema btn-lg mt-3"
            >
              Book Ticket Now
            </Link>
          ) : (
            <button
              className="btn btn-secondary btn-lg mt-3"
              disabled
            >
              Coming Soon
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
