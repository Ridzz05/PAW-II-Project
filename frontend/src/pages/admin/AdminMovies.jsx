
import { useEffect, useState } from "react";
import { Film, Plus, Pencil, Trash2, X } from "lucide-react";
import api from "../../services/api";

const initialForm = {
  title: "",
  genre: "",
  duration: "",
  rating: "",
  ageRating: "",
  language: "",
  synopsis: "",
  posterUrl: "",
  status: "now_showing",
  releaseDate: "",
};

function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/movies", {
        params: {
          search,
          limit: 100,
        },
      });

      setMovies(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil data film."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [search]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (movie) => {
    setEditingId(movie._id);

    setForm({
      title: movie.title || "",
      genre: Array.isArray(movie.genre)
        ? movie.genre.join(", ")
        : "",
      duration: movie.duration ?? "",
      rating: movie.rating ?? "",
      ageRating: movie.ageRating || "",
      language: movie.language || "",
      synopsis: movie.synopsis || "",
      posterUrl: movie.posterUrl || "",
      status: movie.status || "now_showing",
      releaseDate: movie.releaseDate
        ? String(movie.releaseDate).slice(0, 10)
        : "",
    });

    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const payload = {
        ...form,
        genre: form.genre
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        duration: Number(form.duration),
        rating: Number(form.rating),
      };

      if (editingId) {
        await api.put(`/movies/${editingId}`, payload);
        alert("Data film berhasil diperbarui.");
      } else {
        await api.post("/movies", payload);
        alert("Film berhasil ditambahkan.");
      }

      setShowForm(false);
      setForm(initialForm);
      setEditingId(null);

      await fetchMovies();
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menyimpan data film."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus film ini?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/movies/${id}`);
      alert("Film berhasil dihapus.");
      await fetchMovies();
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menghapus film."
      );
    }
  };

  return (
    <div className="container py-5 admin-movies-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <Film size={25} />
            <span className="text-secondary">CINOVERSE ADMIN</span>
          </div>

          <h2 className="fw-bold">Kelola Film</h2>
          <p className="text-secondary mb-0">
            Tambah, edit, dan hapus data film CINOVERSE.
          </p>
        </div>

        <button className="btn btn-cinema" onClick={openAddForm}>
          <Plus size={18} className="me-2" />
          Tambah Film
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="admin-movie-toolbar mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Cari judul film..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="admin-form-card mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">
              {editingId ? "Edit Film" : "Tambah Film Baru"}
            </h4>

            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={() => setShowForm(false)}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Judul Film</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Genre (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  name="genre"
                  className="form-control"
                  placeholder="Action, Adventure, Sci-Fi"
                  value={form.genre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Durasi (menit)</label>
                <input
                  type="number"
                  name="duration"
                  className="form-control"
                  min="1"
                  value={form.duration}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Rating (0–10)</label>
                <input
                  type="number"
                  name="rating"
                  className="form-control"
                  min="0"
                  max="10"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Rating Usia</label>
                <input
                  type="text"
                  name="ageRating"
                  className="form-control"
                  placeholder="SU, 13+, 17+, 21+"
                  value={form.ageRating}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Bahasa</label>
                <input
                  type="text"
                  name="language"
                  className="form-control"
                  value={form.language}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Tanggal Rilis</label>
                <input
                  type="date"
                  name="releaseDate"
                  className="form-control"
                  value={form.releaseDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">URL Poster Film</label>
                <input
                  type="url"
                  name="posterUrl"
                  className="form-control"
                  placeholder="https://example.com/poster.jpg"
                  value={form.posterUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Status Film</label>
                <select
                  name="status"
                  className="form-select"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="now_showing">Now Showing</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Sinopsis</label>
                <textarea
                  name="synopsis"
                  className="form-control"
                  rows="4"
                  value={form.synopsis}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-cinema"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Film"}
              </button>

              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => setShowForm(false)}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-card">
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Judul Film</th>
                <th>Genre</th>
                <th>Durasi</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading && movies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Memuat data film...
                  </td>
                </tr>
              ) : movies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Belum ada data film.
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr key={movie._id}>
                    <td>
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="admin-movie-poster"
                        />
                      ) : (
                        <div className="admin-movie-no-poster">
                          No Poster
                        </div>
                      )}
                    </td>

                    <td className="fw-semibold">{movie.title}</td>

                    <td>
                      {Array.isArray(movie.genre)
                        ? movie.genre.join(", ")
                        : movie.genre}
                    </td>

                    <td>{movie.duration} menit</td>
                    <td>{movie.rating}/10</td>

                    <td>
                      <span className={`badge ${
                        movie.status === "now_showing"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}>
                        {movie.status === "now_showing"
                          ? "Now Showing"
                          : "Coming Soon"}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-info"
                          title="Edit film"
                          onClick={() => openEditForm(movie)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Hapus film"
                          onClick={() => handleDelete(movie._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminMovies;
