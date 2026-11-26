
import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  X,
  MapPin,
} from "lucide-react";
import api from "../../services/api";

const emptyStudio = {
  name: "",
  type: "Regular",
  rows: 5,
  cols: 10,
};

const initialForm = {
  name: "",
  city: "",
  address: "",
  studios: [{ ...emptyStudio }],
};

function AdminCinemas() {
  const [cinemas, setCinemas] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCinemas = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cinemas", {
        params: { search },
      });

      setCinemas(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil data bioskop."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, [search]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudioChange = (index, e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      studios: prev.studios.map((studio, i) =>
        i === index
          ? {
              ...studio,
              [name]: value,
            }
          : studio
      ),
    }));
  };

  const addStudio = () => {
    setForm((prev) => ({
      ...prev,
      studios: [...prev.studios, { ...emptyStudio }],
    }));
  };

  const removeStudio = (index) => {
    setForm((prev) => ({
      ...prev,
      studios: prev.studios.filter((_, i) => i !== index),
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      ...initialForm,
      studios: [{ ...emptyStudio }],
    });
    setShowForm(true);
    setError("");
  };

  const openEditForm = (cinema) => {
    setEditingId(cinema._id);

    setForm({
      name: cinema.name || "",
      city: cinema.city || "",
      address: cinema.address || "",
      studios: cinema.studios?.length
        ? cinema.studios.map((studio) => ({
            name: studio.name || "",
            type: studio.type || "Regular",
            rows: studio.rows ?? 5,
            cols: studio.cols ?? 10,
          }))
        : [{ ...emptyStudio }],
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
        name: form.name.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        studios: form.studios.map((studio) => ({
          name: studio.name.trim(),
          type: studio.type,
          rows: Number(studio.rows),
          cols: Number(studio.cols),
        })),
      };

      if (editingId) {
        await api.put(`/cinemas/${editingId}`, payload);
        alert("Data bioskop berhasil diperbarui.");
      } else {
        await api.post("/cinemas", payload);
        alert("Bioskop berhasil ditambahkan.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({
        ...initialForm,
        studios: [{ ...emptyStudio }],
      });

      await fetchCinemas();
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menyimpan data bioskop."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus bioskop ini?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/cinemas/${id}`);
      alert("Bioskop berhasil dihapus.");
      await fetchCinemas();
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menghapus data bioskop."
      );
    }
  };

  return (
    <div className="container py-5 admin-cinemas-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <Building2 size={25} />
            <span className="text-secondary">CINOVERSE ADMIN</span>
          </div>

          <h2 className="fw-bold">Kelola Bioskop</h2>

          <p className="text-secondary mb-0">
            Tambah, edit, dan hapus data bioskop beserta studionya.
          </p>
        </div>

        <button className="btn btn-cinema" onClick={openAddForm}>
          <Plus size={18} className="me-2" />
          Tambah Bioskop
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-cinema-search mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Cari nama bioskop atau kota..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="admin-form-card mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">
              {editingId ? "Edit Bioskop" : "Tambah Bioskop"}
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
                <label className="form-label">Nama Bioskop</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Kota</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Alamat</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows="2"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
              <h5 className="fw-bold mb-0">Daftar Studio</h5>

              <button
                type="button"
                className="btn btn-outline-info btn-sm"
                onClick={addStudio}
              >
                <Plus size={16} className="me-1" />
                Tambah Studio
              </button>
            </div>

            {form.studios.map((studio, index) => (
              <div className="admin-studio-form mb-3" key={index}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">
                    Studio {index + 1}
                  </h6>

                  {form.studios.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeStudio(index)}
                    >
                      <Trash2 size={15} className="me-1" />
                      Hapus
                    </button>
                  )}
                </div>

                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Nama Studio</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Studio 1"
                      value={studio.name}
                      onChange={(e) => handleStudioChange(index, e)}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Tipe Studio</label>
                    <select
                      name="type"
                      className="form-select"
                      value={studio.type}
                      onChange={(e) => handleStudioChange(index, e)}
                    >
                      <option value="Regular">Regular</option>
                      <option value="IMAX">IMAX</option>
                      <option value="Premiere">Premiere</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Jumlah Baris</label>
                    <input
                      type="number"
                      name="rows"
                      className="form-control"
                      min="1"
                      value={studio.rows}
                      onChange={(e) => handleStudioChange(index, e)}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Jumlah Kolom</label>
                    <input
                      type="number"
                      name="cols"
                      className="form-control"
                      min="1"
                      value={studio.cols}
                      onChange={(e) => handleStudioChange(index, e)}
                      required
                    />
                  </div>
                </div>

                <p className="text-secondary small mt-2 mb-0">
                  Kapasitas studio: {Number(studio.rows) * Number(studio.cols)} kursi
                </p>
              </div>
            ))}

            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-cinema"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Bioskop"}
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

      {loading && cinemas.length === 0 ? (
        <p className="text-secondary">Memuat data bioskop...</p>
      ) : cinemas.length === 0 ? (
        <div className="admin-empty-state">
          Belum ada data bioskop.
        </div>
      ) : (
        <div className="row g-4">
          {cinemas.map((cinema) => (
            <div className="col-md-6 col-xl-4" key={cinema._id}>
              <div className="admin-cinema-card h-100">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <h5 className="fw-bold mb-2">{cinema.name}</h5>

                    <p className="text-secondary mb-1">
                      <MapPin size={15} className="me-1" />
                      {cinema.city}
                    </p>
                  </div>

                  <Building2 size={25} className="text-info" />
                </div>

                <p className="admin-cinema-address mt-3">
                  {cinema.address}
                </p>

                <div className="divider-admin my-3" />

                <h6 className="fw-semibold mb-3">
                  Studio ({cinema.studios?.length || 0})
                </h6>

                {cinema.studios?.length ? (
                  cinema.studios.map((studio, index) => (
                    <div className="admin-studio-item" key={studio._id || index}>
                      <div>
                        <strong>{studio.name}</strong>
                        <div className="text-secondary small">
                          {studio.type}
                        </div>
                      </div>

                      <span className="small">
                        {studio.rows} × {studio.cols} kursi
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-secondary small">
                    Belum ada studio.
                  </p>
                )}

                <div className="d-flex gap-2 mt-4">
                  <button
                    className="btn btn-sm btn-outline-info flex-fill"
                    onClick={() => openEditForm(cinema)}
                  >
                    <Pencil size={15} className="me-1" />
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger flex-fill"
                    onClick={() => handleDelete(cinema._id)}
                  >
                    <Trash2 size={15} className="me-1" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCinemas;
