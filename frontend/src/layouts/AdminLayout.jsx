
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Film,
  LogOut,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="admin-layout">
      <nav className="admin-topbar">
        <div className="admin-topbar-brand">
          <Film size={27} />
          <span>
            CINO<span className="brand-highlight">VERSE</span>
          </span>
          <span className="admin-label">ADMIN</span>
        </div>

        <div className="admin-topbar-actions">
          {!isDashboard && (
            <button
              className="btn btn-outline-light"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft size={17} className="me-2" />
              Kembali ke Dashboard
            </button>
          )}

          {isDashboard && (
            <span className="admin-welcome">
              <LayoutDashboard size={17} className="me-2" />
              Admin Dashboard
            </span>
          )}

          <button
            className="btn btn-outline-light"
            onClick={handleLogout}
          >
            <LogOut size={17} className="me-2" />
            Logout
          </button>
        </div>
      </nav>

      <main className="admin-layout-content">
        <Outlet />
      </main>
    </div>
  );
}
