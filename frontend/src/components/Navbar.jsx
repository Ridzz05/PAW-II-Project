
import { Link } from "react-router-dom";
import { Film, Ticket, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg cinema-navbar">
      <div className="container">
        <Link className="navbar-brand cinema-brand" to="/">
          <Film size={27} />
          <span>
            CINO<span className="brand-highlight">VERSE</span>
          </span>
        </Link>

        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/movies">
                Movies
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/cinemas">
                Cinemas
              </Link>
            </li>

            {/* MENU SHOWTIMES */}
            <li className="nav-item">
              <Link className="nav-link" to="/showtimes">
                Showtimes
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/riwayat">
                My Tickets
              </Link>
            </li>
          </ul>

          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-light">
              <User size={17} className="me-1" />
              Login
            </Link>

            <Link to="/register" className="btn btn-cinema">
              <Ticket size={17} className="me-1" />
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
