
import { useParams, Link } from "react-router-dom";
import { Star, Clock, Calendar, ArrowLeft } from "lucide-react";

const movies = [
  {
    id: "1",
    title: "Avengers: Endgame",
    genre: "Action / Adventure",
    rating: "8.4",
    duration: 181,
    release: "April 26, 2019",
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    description:
      "After the devastating events of Avengers: Infinity War, the universe is in ruins. The Avengers assemble once more to reverse the damage and restore balance to the universe."
  },
  {
    id: "2",
    title: "Interstellar",
    genre: "Sci-Fi / Drama",
    rating: "8.7",
    duration: 169,
    release: "November 7, 2014",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description:
      "A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars."
  },
  {
    id: "3",
    title: "The Batman",
    genre: "Action / Crime",
    rating: "7.8",
    duration: 176,
    release: "March 4, 2022",
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    description:
      "Batman investigates corruption in Gotham City while pursuing a mysterious criminal known as the Riddler."
  },
  {
    id: "4",
    title: "Dune",
    genre: "Sci-Fi / Adventure",
    rating: "8.0",
    duration: 155,
    release: "October 22, 2021",
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    description:
      "A young nobleman travels to a dangerous desert planet to secure the future of his family and people."
  }
];

export default function MovieDetail() {
  const { id } = useParams();

  const movie = movies.find((item) => item.id === id);

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <h2>Movie Not Found</h2>
        <Link to="/movies" className="btn btn-cinema mt-3">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="container movie-detail-section">

      <Link to="/movies" className="back-link">
        <ArrowLeft size={18} /> Back to Movies
      </Link>

      <div className="row g-5 mt-3 align-items-center">

        <div className="col-md-4">
          <img
            src={movie.poster}
            alt={movie.title}
            className="detail-poster"
          />
        </div>

        <div className="col-md-8">

          <span className="section-label">
            MOVIE DETAILS
          </span>

          <h1 className="detail-title mt-3">
            {movie.title}
          </h1>

          <p className="detail-genre">
            {movie.genre}
          </p>

          <div className="detail-meta">
            <span>
              <Star className="star-icon" size={18} />
              {movie.rating}
            </span>

            <span>
              <Clock size={18} />
              {movie.duration} minutes
            </span>

            <span>
              <Calendar size={18} />
              {movie.release}
            </span>
          </div>

          <h5 className="mt-5">Synopsis</h5>

          <p className="detail-description">
            {movie.description}
          </p>

          <Link
            to={`/showtimes/${movie.id}`}
            className="btn btn-cinema btn-lg mt-3"
          >
            Book Ticket Now
          </Link>

        </div>
      </div>
    </div>
  );
}
