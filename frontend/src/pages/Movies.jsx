
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import api from "../services/api";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/movies", {
          params: {
            search: search || undefined,
            limit: 100,
          },
        });

        setMovies(response.data.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Gagal mengambil data film dari server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [search]);

  return (
    <div className="container py-5">
      <h2 className="text-white mb-2">Jelajahi Film</h2>

      <p className="text-secondary mb-4">
        Temukan film favoritmu di CINOVERSE.
      </p>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Cari judul film..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && (
        <p className="text-white">Memuat data film...</p>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!loading && !error && movies.length === 0 && (
        <p className="text-secondary">Belum ada film ditemukan.</p>
      )}

      <div className="row g-4">
        {movies.map((movie) => (
          <div className="col-6 col-md-4 col-lg-3" key={movie._id}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Movies;
