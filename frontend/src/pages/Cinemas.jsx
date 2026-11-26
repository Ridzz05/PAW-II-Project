
import { useEffect, useState } from "react";
import { Search, MapPin, Film, Armchair } from "lucide-react";
import api from "../services/api";

export default function Cinemas() {
  const [cinemas, setCinemas] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/cinemas", {
          params: {
            search: search || undefined,
            city: city || undefined,
          },
        });

        setCinemas(response.data.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Gagal mengambil data bioskop."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, [search, city]);

  const cities = [
    ...new Set(cinemas.map((cinema) => cinema.city).filter(Boolean)),
  ];

  return (
    <div className="container py-5">
      <div className="mb-5">
        <span className="section-label">OUR CINEMAS</span>
        <h1 className="text-white mt-2">Find Your Cinema</h1>
        <p className="text-secondary">
          Temukan lokasi bioskop dan studio favoritmu bersama CINOVERSE.
        </p>
      </div>

      {/* SEARCH AND FILTER */}
      <div className="row g-3 mb-5">
        <div className="col-md-7">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={18} />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Cari nama bioskop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-5">
          <select
            className="form-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Semua Kota</option>

            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CINEMA LIST */}
      {loading && (
        <p className="text-white">Memuat data bioskop...</p>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!loading && !error && cinemas.length === 0 && (
        <p className="text-secondary">
          Belum ada bioskop yang ditemukan.
        </p>
      )}

      <div className="row g-4">
        {cinemas.map((cinema) => (
          <div className="col-md-6 col-lg-4" key={cinema._id}>
            <div className="card h-100 cinema-card">
              <div className="cinema-card-header">
                <Film size={42} />
                <span className="cinema-city">
                  {cinema.city}
                </span>
              </div>

              <div className="card-body">
                <h4 className="card-title">
                  {cinema.name}
                </h4>

                <p className="text-secondary">
                  <MapPin size={16} className="me-2" />
                  {cinema.address}
                </p>

                <hr />

                <h6 className="mb-3">
                  Available Studios
                </h6>

                {cinema.studios?.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {cinema.studios.map((studio, index) => (
                      <div
                        key={`${cinema._id}-${studio.name}-${index}`}
                        className="studio-item"
                      >
                        <div>
                          <strong>{studio.name}</strong>
                          <div className="small text-secondary">
                            {studio.type}
                          </div>
                        </div>

                        <div className="small text-secondary">
                          <Armchair size={15} className="me-1" />
                          {studio.rows * studio.cols} seats
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="small text-secondary">
                    Belum ada studio tersedia.
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
