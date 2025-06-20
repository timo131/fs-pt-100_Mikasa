import { useState, useEffect } from "react";
import { searchMovies } from "../services/omdbApi";
import "../styles/Ocio.css";

export const Ocio = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [likes, setLikes] = useState([]);
  const [ratings, setRatings] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoritos");
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));

    const storedLikes = localStorage.getItem("likes");
    if (storedLikes) setLikes(JSON.parse(storedLikes));

    const storedRatings = localStorage.getItem("ratings");
    if (storedRatings) setRatings(JSON.parse(storedRatings));
  }, []);

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("likes", JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    localStorage.setItem("ratings", JSON.stringify(ratings));
  }, [ratings]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    const movies = await searchMovies(query);
    setResults(movies);
  };

  const toggleFavorite = (movie) => {
    const isFav = favorites.some((fav) => fav.imdbID === movie.imdbID);
    if (isFav) {
      setFavorites(favorites.filter((fav) => fav.imdbID !== movie.imdbID));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const openModal = (movie) => {
    const isLiked = likes.some((like) => like.imdbID === movie.imdbID);
    if (!isLiked) setLikes([...likes, movie]);

    setSelectedMovie(movie);
    const modal = new window.bootstrap.Modal(document.getElementById("ratingModal"));
    modal.show();
  };

  const handleRatingChange = (movieId, ratingValue) => {
    setRatings((prev) => ({
      ...prev,
      [movieId]: ratingValue,
    }));
  };

  useEffect(() => {
    const loadDefaultMovies = async () => {
      const movies = await searchMovies("movie");
      setResults(movies);
    };
    loadDefaultMovies();
  }, []);

  return (
    <div className="container-ocio">
      <nav className="navbar bg-body-tertiary">
  <div className="container-fluid d-flex justify-content-end">
    <form className="d-flex" role="search" onSubmit={handleSearch}>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Busca películas o series"
        aria-label="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-outline-success" type="submit">
        <i className="fa-solid fa-magnifying-glass"></i> Buscar
      </button>
    </form>
  </div>
</nav>

      <h1 className="text-center my-5">Películas y Series</h1>

      {favorites.length > 0 && (
        <div className="favorites mt-5 section-highlight">
          <h2 className="text-center d-flex justify-content-center align-items-center gap-2">
            <i className="fa-solid fa-heart fa-xl text-danger"></i>
            Mis Favoritas
            <i className="fa-solid fa-heart fa-xl text-danger"></i>
          </h2>
          <div className="movie-carousel">
            {favorites.map((movie) => (
              <div key={movie.imdbID} className="movie-card">
                {movie.Poster && movie.Poster !== "N/A" && (
                  <img src={movie.Poster} alt={movie.Title} />
                )}
                <h6>
                  {movie.Title} ({movie.Year})
                </h6>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="search-results mt-4">
          <div className="movie-carousel">
            {results.map((movie) => {
              const isLiked = likes.some((like) => like.imdbID === movie.imdbID);
              return (
                <div key={movie.imdbID} className="movie-card">
                  {movie.Poster && movie.Poster !== "N/A" && (
                    <img src={movie.Poster} alt={movie.Title} />
                  )}
                  <h6>
                    {movie.Title} ({movie.Year})
                  </h6>
                  <div className="movie-buttons">
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => (window.location.href = `/detalle/${movie.imdbID}`)}
                    >
                      Detalles
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => toggleFavorite(movie)}
                      title="Añadir a favoritos"
                    >
                      {favorites.some((fav) => fav.imdbID === movie.imdbID) ? (
                        <i className="fa-solid fa-heart fa-lg text-danger"></i>
                      ) : (
                        <i className="fa-regular fa-heart fa-lg"></i>
                      )}
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => openModal(movie)}
                      title="Quiero ver"
                    >
                      {isLiked ? (
                        <i className="fa-solid fa-thumbs-up fa-lg text-primary"></i>
                      ) : (
                        <i className="fa-regular fa-thumbs-up fa-lg"></i>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {likes.length > 0 && (
        <div className="favorites mt-5 section-highlight">
          <h2 className="text-center d-flex justify-content-center align-items-center gap-2">
            <i className="fa-solid fa-eye fa-xl"></i>
            Películas que quiero ver
            <i className="fa-solid fa-film fa-xl"></i>
          </h2>
          <div className="movie-carousel">
            {likes.map((movie) => (
              <div key={movie.imdbID} className="movie-card">
                {movie.Poster && movie.Poster !== "N/A" && (
                  <img src={movie.Poster} alt={movie.Title} />
                )}
                <h6>
                  {movie.Title} ({movie.Year})
                </h6>
                <p className="mt-2">
                  {ratings[movie.imdbID]
                    ? `Te apetece: ${ratings[movie.imdbID]}`
                    : "Sin valorar"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className="modal fade"
        id="ratingModal"
        tabIndex="-1"
        aria-labelledby="ratingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ratingModalLabel">
                ¿Cuánto te apetece ver esta película?
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              {selectedMovie && (
                <div className="d-flex flex-column gap-2">
                  {["No me gusta", "Ni fu ni fa", "Podría verla", "Me apetece", "Me encanta"].map(
                    (label, index) => (
                      <button
                        key={index}
                        className="btn btn-outline-primary"
                        onClick={() =>
                          handleRatingChange(selectedMovie.imdbID, label)
                        }
                        data-bs-dismiss="modal"
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
