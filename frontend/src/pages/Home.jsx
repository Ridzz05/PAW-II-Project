
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import api from "../services/api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/movies?status=now_showing");

        setMovies(response.data.data || []);
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

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <span className="hero-label">
              YOUR MOVIE EXPERIENCE STARTS HERE
            </span>

            <h1>
              Experience Movies
              <br />
              <span>Like Never Before.</span>
            </h1>

            <p>
              Discover your favorite movies and book
              your cinema tickets easily with CINOVERSE.
            </p>

            <Link to="/movies" className="btn btn-cinema btn-lg">
              Explore Movies
            </Link>
          </div>
        </div>
      </section>

      {/* NOW SHOWING SECTION */}
      <section className="container movie-section">
        <div className="section-heading">
          <div>
            <span className="section-label">NOW SHOWING</span>
            <h2>Popular Movies</h2>
          </div>

          <Link to="/movies" className="view-all">
            View All →
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
      </section>
    </>
  );
}
