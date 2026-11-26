
import { Link } from "react-router-dom";
import {
  Film,
  Building2,
  CalendarDays,
  Ticket,
  Users,
} from "lucide-react";

const adminMenus = [
  {
    title: "Kelola Film",
    description: "Tambah, edit, dan hapus data film.",
    icon: Film,
    path: "/admin/movies",
  },
  {
    title: "Kelola Bioskop",
    description: "Kelola data bioskop dan studio.",
    icon: Building2,
    path: "/admin/cinemas",
  },
  {
    title: "Kelola Jadwal",
    description: "Atur jadwal tayang film.",
    icon: CalendarDays,
    path: "/admin/showtimes",
  },
  {
    title: "Kelola Pemesanan",
    description: "Lihat dan kelola pemesanan tiket.",
    icon: Ticket,
    path: "/admin/bookings",
  },
  {
    title: "Kelola Pengguna",
    description: "Lihat data pengguna CINOVERSE.",
    icon: Users,
    path: "/admin/users",
  },
];

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="container py-5">
      <div className="mb-5">
        <p className="text-uppercase text-secondary mb-2">
          CINOVERSE Administration
        </p>

        <h2 className="fw-bold">Dashboard Admin</h2>

        <p className="text-secondary">
          Selamat datang, {user?.name || user?.nama || "Admin"}.
          Kelola seluruh data aplikasi CINOVERSE melalui halaman ini.
        </p>
      </div>

      <div className="row g-4">
        {adminMenus.map((menu) => {
          const Icon = menu.icon;

          return (
            <div className="col-md-6 col-lg-4" key={menu.title}>
              <Link
                to={menu.path}
                className="admin-menu-card text-decoration-none"
              >
                <div className="admin-menu-icon">
                  <Icon size={28} />
                </div>

                <h5 className="fw-bold mt-3">{menu.title}</h5>

                <p className="text-secondary mb-0">
                  {menu.description}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminDashboard;
