
import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";

function MovieCard({ movie }) {
  return (
    <div className="card movie-card h-100">
      <img
        src={
          movie.posterUrl ||
          "https://placehold.co/400x600/211936/ffffff?text=No+Poster"
        }
        className="card-img-top movie-poster"
        alt={movie.title}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{movie.title}</h5>

        <p className="text-secondary small mb-2">
          {Array.isArray(movie.genre)
            ? movie.genre.join(", ")
            : movie.genre}
        </p>

        <div className="d-flex justify-content-between small mb-3">
          <span>
            <Star size={15} className="me-1 text-warning" />
            {movie.rating ?? 0}/10
          </span>

          <span>
            <Clock size={15} className="me-1" />
            {movie.duration} menit
          </span>
        </div>

        <div className="mt-auto">
          <Link
            to={`/movies/${movie._id}`}
            className="btn btn-primary w-100"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
