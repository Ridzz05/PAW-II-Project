
import { Link, useNavigate } from "react-router-dom";
import { Film, Ticket, User, LogOut } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const isLoggedIn = Boolean(token);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        window.location.reload();
    };

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
                            <Link className="nav-link" to="/">Home</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/movies">Movies</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/cinemas">Cinemas</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/showtimes">
                                Showtimes
                            </Link>
                        </li>

                        {isLoggedIn && user?.role !== "admin" && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/riwayat">
                                    My Tickets
                                </Link>
                            </li>
                        )}
                    </ul>

                    <div className="d-flex gap-2">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline-light"
                            >
                                <LogOut size={17} className="me-1" />
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline-light">
                                    <User size={17} className="me-1" />
                                    Login
                                </Link>

                                <Link to="/register" className="btn btn-cinema">
                                    <Ticket size={17} className="me-1" />
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
