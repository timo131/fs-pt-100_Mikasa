import { useState, useEffect } from "react";
import { searchMovies } from "../services/omdbApi";
import "../styles/Ocio.css";

export const Ocio = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [likes, setLikes] = useState([]);
  const [ratings, setRatings] = useState({}); 
  
  
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

  const toggleLike = (movie) => {
    const isLiked = likes.some((like) => like.imdbID === movie.imdbID);
    if (isLiked) {
      
      setLikes(likes.filter((like) => like.imdbID !== movie.imdbID));
      setRatings((prev) => {
        const newRatings = { ...prev };
        delete newRatings[movie.imdbID];
        return newRatings;
      });
    } else {
      setLikes([...likes, movie]);
    }
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
        <div className="container-fluid">
          <a className="navbar-brand">
            <i className="fa-solid fa-tv"></i> <i className="fa-solid fa-film"></i>
          </a>
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
              Buscar
            </button>
          </form>
        </div>
      </nav>

      <h1 className="text-center my-5">Películas y Series</h1>

      {results.length > 0 && (
        <div className="search-results mt-4">
          <div className="movie-carousel">
            {results.map((movie) => {
              const isLiked = likes.some((like) => like.imdbID === movie.imdbID);
              const currentRating = ratings[movie.imdbID] || null;
              return (
                <div key={movie.imdbID} className="movie-card">
                  {movie.Poster && movie.Poster !== "N/A" && (
                    <img src={movie.Poster} alt={movie.Title} />
                  )}
                  <h6>{movie.Title} ({movie.Year})</h6>
                  <div className="d-flex justify-content-between mt-2">
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() =>
                        (window.location.href = `/detalle/${movie.imdbID}`)
                      }
                    >
                      Detalles
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => toggleFavorite(movie)}
                      title="Añadir a favoritos"
                    >
                      {favorites.some((fav) => fav.imdbID === movie.imdbID) ? (
                        <i className="fa-solid fa-heart text-danger"></i>
                      ) : (
                        <i className="fa-regular fa-heart"></i>
                      )}
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => toggleLike(movie)}
                      title="Quiero ver"
                    >
                      {isLiked ? (
                        <i className="fa-solid fa-thumbs-up text-primary"></i>
                      ) : (
                        <i className="fa-regular fa-thumbs-up"></i>
                      )}
                    </button>
                  </div>

                  
                  {isLiked && (
                    <div className="mt-2 d-flex justify-content-start flex-wrap">
                      {[
                        { id: 1, label: "mehhhh" },
                        { id: 2, label: "no me apetece" },
                        { id: 3, label: "ni fu ni fa" },
                        { id: 4, label: "me apetece" },
                        { id: 5, label: "me apetece mogollon" },
                      ].map(({ id, label }) => (
                        <div className="form-check form-check-inline" key={id}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`rating-${movie.imdbID}`}
                            id={`rating-${movie.imdbID}-${id}`}
                            value={label}
                            checked={ratings[movie.imdbID] === label}
                            onChange={() => handleRatingChange(movie.imdbID, label)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`rating-${movie.imdbID}-${id}`}
                          >
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="favorites mt-5">
          <h2 className="text-center">Mis Favoritas</h2>
          <div className="movie-carousel">
            {favorites.map((movie) => (
              <div key={movie.imdbID} className="movie-card">
                {movie.Poster && movie.Poster !== "N/A" && (
                  <img src={movie.Poster} alt={movie.Title} />
                )}
                <h6>{movie.Title} ({movie.Year})</h6>
              </div>
            ))}
          </div>
        </div>
      )}

      {likes.length > 0 && (
        <div className="favorites mt-5">
          <h2 className="text-center">Películas que quiero ver</h2>
          <div className="movie-carousel">
            {likes.map((movie) => {
              const currentRating = ratings[movie.imdbID] || null;
              return (
                <div key={movie.imdbID} className="movie-card">
                  {movie.Poster && movie.Poster !== "N/A" && (
                    <img src={movie.Poster} alt={movie.Title} />
                  )}
                  <h6>{movie.Title} ({movie.Year})</h6>

                  <div className="mt-2 d-flex justify-content-start flex-wrap">
                    {[
                      "mehhhh",
                      "no me apetece",
                      "ni fu ni fa",
                      "me apetece",
                      "me apetece mogollon",
                    ].map((label, index) => (
                      <div className="form-check form-check-inline" key={index}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`rating-display-${movie.imdbID}`}
                          id={`rating-display-${movie.imdbID}-${index}`}
                          value={label}
                          checked={currentRating === label}
                          disabled
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`rating-display-${movie.imdbID}-${index}`}
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
