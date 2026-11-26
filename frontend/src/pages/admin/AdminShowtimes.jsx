
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import api from "../../services/api";

const initialForm = {
  movieId: "",
  cinemaId: "",
  studioName: "",
  studioType: "Regular",
  date: "",
  time: "",
  price: "",
};

function AdminShowtimes() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedCinema = cinemas.find(
    (cinema) => cinema._id === form.cinemaId
  );

  const availableStudios = selectedCinema?.studios || [];

  const fetchShowtimes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/showtimes");
      setShowtimes(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil data jadwal."
      );
    } finally {
      setLoading(false);
    }
  };

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
          "Gagal mengambil pilihan film atau bioskop."
      );
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchShowtimes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "cinemaId"
        ? { studioName: "", studioType: "Regular" }
        : {}),
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...initialForm });
    setShowForm(true);
    setError("");
  };

  const openEditForm = (showtime) => {
    setEditingId(showtime._id);

    setForm({
      movieId: showtime.movieId?._id || showtime.movieId || "",
      cinemaId: showtime.cinemaId?._id || showtime.cinemaId || "",
      studioName: showtime.studioName || "",
      studioType: showtime.studioType || "Regular",
      date: showtime.date || "",
      time: showtime.time || "",
      price: showtime.price ?? "",
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
        movieId: form.movieId,
        cinemaId: form.cinemaId,
        studioName: form.studioName,
        studioType: form.studioType,
        date: form.date,
        time: form.time,
        price: Number(form.price),
      };

      if (editingId) {
        await api.put(`/showtimes/${editingId}`, payload);
        alert("Jadwal tayang berhasil diperbarui.");
      } else {
        await api.post("/showtimes", payload);
        alert("Jadwal tayang berhasil ditambahkan.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...initialForm });

      await fetchShowtimes();
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menyimpan jadwal tayang."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus jadwal ini?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/showtimes/${id}`);
      alert("Jadwal tayang berhasil dihapus.");
      await fetchShowtimes();
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menghapus jadwal tayang."
      );
    }
  };

  return (
    <div className="container py-5 admin-showtimes-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <CalendarDays size={25} />
            <span className="text-secondary">CINOVERSE ADMIN</span>
          </div>

          <h2 className="fw-bold">Kelola Jadwal Tayang</h2>

          <p className="text-secondary mb-0">
            Atur film, bioskop, studio, tanggal, jam, dan harga tiket.
          </p>
        </div>

        <button className="btn btn-cinema" onClick={openAddForm}>
          <Plus size={18} className="me-2" />
          Tambah Jadwal
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="admin-form-card mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">
              {editingId ? "Edit Jadwal Tayang" : "Tambah Jadwal Tayang"}
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
                <label className="form-label">Pilih Film</label>
                <select
                  name="movieId"
                  className="form-select"
                  value={form.movieId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih Film --</option>
                  {movies.map((movie) => (
                    <option key={movie._id} value={movie._id}>
                      {movie.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Pilih Bioskop</label>
                <select
                  name="cinemaId"
                  className="form-select"
                  value={form.cinemaId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih Bioskop --</option>
                  {cinemas.map((cinema) => (
                    <option key={cinema._id} value={cinema._id}>
                      {cinema.name} - {cinema.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Pilih Studio</label>
                <select
                  name="studioName"
                  className="form-select"
                  value={form.studioName}
                  onChange={(e) => {
                    const studio = availableStudios.find(
                      (item) => item.name === e.target.value
                    );

                    setForm((prev) => ({
                      ...prev,
                      studioName: e.target.value,
                      studioType: studio?.type || "Regular",
                    }));
                  }}
                  disabled={!form.cinemaId}
                  required
                >
                  <option value="">-- Pilih Studio --</option>
                  {availableStudios.map((studio, index) => (
                    <option key={studio._id || index} value={studio.name}>
                      {studio.name} ({studio.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Tipe Studio</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.studioType}
                  readOnly
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Tanggal Tayang</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Jam Tayang</label>
                <input
                  type="time"
                  name="time"
                  className="form-control"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Harga Tiket (Rp)</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  min="0"
                  value={form.price}
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
                {loading ? "Menyimpan..." : "Simpan Jadwal"}
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
                <th>Film</th>
                <th>Bioskop</th>
                <th>Studio</th>
                <th>Tanggal</th>
                <th>Jam</th>
                <th>Harga</th>
                <th>Kursi Terisi</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading && showtimes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Memuat jadwal tayang...
                  </td>
                </tr>
              ) : showtimes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Belum ada jadwal tayang.
                  </td>
                </tr>
              ) : (
                showtimes.map((showtime) => (
                  <tr key={showtime._id}>
                    <td className="fw-semibold">
                      {showtime.movieId?.title || "Film tidak ditemukan"}
                    </td>

                    <td>
                      {showtime.cinemaId?.name || "Bioskop tidak ditemukan"}
                      <div className="text-secondary small">
                        {showtime.cinemaId?.city || ""}
                      </div>
                    </td>

                    <td>
                      {showtime.studioName}
                      <div className="text-secondary small">
                        {showtime.studioType}
                      </div>
                    </td>

                    <td>{showtime.date}</td>
                    <td>{showtime.time}</td>

                    <td>
                      Rp {Number(showtime.price).toLocaleString("id-ID")}
                    </td>

                    <td>{showtime.bookedSeats?.length || 0} kursi</td>

                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-info"
                          title="Edit jadwal"
                          onClick={() => openEditForm(showtime)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Hapus jadwal"
                          onClick={() => handleDelete(showtime._id)}
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

export default AdminShowtimes;
