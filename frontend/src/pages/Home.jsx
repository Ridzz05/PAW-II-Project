
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Clock,
  Info,
  Ticket,
  Film,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MovieCard from "../components/MovieCard";
import api from "../services/api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/movies?status=now_showing");
        setMovies(response.data.data || []);
        setActiveIndex(0);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Gagal mengambil data film."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Otomatis berganti setiap 5 detik
  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  const featuredMovie = movies[activeIndex];

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % movies.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (current) => (current - 1 + movies.length) % movies.length
    );
  };

  const featuredImage =
    featuredMovie?.backdropUrl ||
    featuredMovie?.posterUrl ||
    "";

  const genres = Array.isArray(featuredMovie?.genre)
    ? featuredMovie.genre
    : featuredMovie?.genre
      ? [featuredMovie.genre]
      : [];

  return (
    <>
      {/* HERO MOVIE CAROUSEL */}
      <section
        key={featuredMovie?._id || "empty"}
        className="home-hero"
        style={
          featuredImage
            ? {
                backgroundImage: `
                  linear-gradient(
                    90deg,
                    rgba(9, 9, 13, 0.98) 0%,
                    rgba(9, 9, 13, 0.85) 38%,
                    rgba(9, 9, 13, 0.35) 75%,
                    rgba(9, 9, 13, 0.2) 100%
                  ),
                  linear-gradient(
                    0deg,
                    #09090d 0%,
                    transparent 35%
                  ),
                  url("${featuredImage}")
                `,
              }
            : {}
        }
      >
        <div className="container home-hero-container">
          {featuredMovie ? (
            <div className="home-hero-content">
              <div className="home-hero-tags">
                {genres.slice(0, 3).map((genre, index) => (
                  <span key={index} className="home-hero-tag">
                    {genre}
                  </span>
                ))}

                {featuredMovie.ageRating && (
                  <span className="home-hero-age">
                    {featuredMovie.ageRating}
                  </span>
                )}
              </div>

              <h1 className="home-hero-title">
                {featuredMovie.title}
              </h1>

              <p className="home-hero-description">
                {featuredMovie.synopsis ||
                  "Nikmati pengalaman menonton film terbaik bersama CINOVERSE."}
              </p>

              <div className="home-hero-meta">
                {featuredMovie.rating !== undefined && (
                  <span className="home-hero-rating">
                    <Star size={17} fill="currentColor" />
                    {featuredMovie.rating}
                  </span>
                )}

                {featuredMovie.duration && (
                  <span>
                    <Clock size={17} />
                    {featuredMovie.duration} menit
                  </span>
                )}

                {featuredMovie.language && (
                  <span>{featuredMovie.language}</span>
                )}
              </div>

              <div className="home-hero-actions">
                <Link
                  to="/showtimes"
                  className="btn home-btn-primary"
                >
                  <Ticket size={18} />
                  Pesan Tiket
                </Link>

                <Link
                  to={`/movies/${featuredMovie._id}`}
                  className="btn home-btn-outline"
                >
                  <Info size={18} />
                  Info Lebih Lanjut
                </Link>
              </div>
            </div>
          ) : (
            <div className="home-hero-content">
              <span className="home-hero-tag">
                CINOVERSE CINEMA
              </span>

              <h1 className="home-hero-title">
                Temukan Film Favoritmu
              </h1>

              <p className="home-hero-description">
                Nikmati pengalaman menonton dan pesan tiket
                bioskop dengan mudah melalui CINOVERSE.
              </p>

              <Link to="/movies" className="btn home-btn-primary">
                <Film size={18} />
                Lihat Film
              </Link>
            </div>
          )}

          {/* TOMBOL SLIDE */}
          {movies.length > 1 && (
            <>
              <button
                type="button"
                className="home-hero-arrow home-hero-prev"
                onClick={prevSlide}
                aria-label="Film sebelumnya"
              >
                <ChevronLeft size={25} />
              </button>

              <button
                type="button"
                className="home-hero-arrow home-hero-next"
                onClick={nextSlide}
                aria-label="Film berikutnya"
              >
                <ChevronRight size={25} />
              </button>

              {/* INDIKATOR SLIDE */}
              <div className="home-hero-indicators">
                {movies.map((movie, index) => (
                  <button
                    key={movie._id}
                    type="button"
                    className={
                      index === activeIndex ? "active" : ""
                    }
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Tampilkan film ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* NOW SHOWING */}
      <section className="container movie-section home-movie-section">
        <div className="section-heading">
          <div>
            <span className="section-label">NOW SHOWING</span>
            <h2>Film Sedang Tayang</h2>
          </div>

          <Link to="/movies" className="view-all">
            Lihat Semua →
          </Link>
        </div>

        {loading && (
          <p className="text-white">Memuat film...</p>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <p className="text-secondary">
            Belum ada film yang sedang tayang.
          </p>
        )}

        {!loading && !error && movies.length > 0 && (
          <div className="row g-4">
            {movies.map((movie) => (
              <div
                className="col-6 col-md-4 col-lg-3"
                key={movie._id}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
