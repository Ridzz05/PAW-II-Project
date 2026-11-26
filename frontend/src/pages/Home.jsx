
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";

const movies = [
  {
    id: "1",
    title: "Avengers: Endgame",
    genre: "Action / Adventure",
    rating: "8.4",
    duration: 181,
    status: "Now Showing",
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
  },
  {
    id: "2",
    title: "Interstellar",
    genre: "Sci-Fi / Drama",
    rating: "8.7",
    duration: 169,
    status: "Now Showing",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    id: "3",
    title: "The Batman",
    genre: "Action / Crime",
    rating: "7.8",
    duration: 176,
    status: "Now Showing",
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
  },
  {
    id: "4",
    title: "Dune",
    genre: "Sci-Fi / Adventure",
    rating: "8.0",
    duration: 155,
    status: "Now Showing",
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
  },
];

export default function Home() {
  return (
    <>
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

        <div className="row g-4">
          {movies.map((movie) => (
            <div
              className="col-6 col-md-4 col-lg-3"
              key={movie.id}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
