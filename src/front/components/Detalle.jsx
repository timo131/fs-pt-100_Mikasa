

import { useEffect, useState } from "react";
import omdbApi from "../services/omdbApi";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/Ocio.css";

export const Detalle = ({ id }) => {
  const { store, dispatch } = useGlobalReducer();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return null;
    if (!movie) {

      setLoading(true);
      omdbApi
        .getMovieById(id)
        .then((data) => {
          dispatch({ type: "ADD_MOVIE", payload: data });
          setMovie(data);
        })
        .catch((err) => console.error("Error fetching movie:", err))
        .finally(() => setLoading(false));
    }
  }, [id, movie, dispatch]);

  if (loading || !movie) {
    return <p>Cargando…</p>;
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-center h-100">
            {movie.Poster && movie.Poster !== "N/A" && (
              <img src={movie.Poster} alt={movie.Title} className="recipe-img" />
            )}
          </div>
        </div>
        <div className="col">
          <p>{movie.Genre}</p>
          {movie.imdbRating && (
            <p>
              <span className="fa-solid charcoal fa-star me-2"></span>
              <strong>IMDB:</strong> {movie.imdbRating}
            </p>
          )}
          {movie.Director && (
            <p>
              <span className="fa-solid charcoal fa-video me-2"></span>
              <strong>Director:</strong> {movie.Director}
            </p>
          )}
          {movie.Actors && (
            <p>
              <span className="fa-solid charcoal fa-users me-2"></span>
              <strong>Reparto:</strong> {movie.Actors}
            </p>
          )}
            <p className="m-0"><strong>Sinopsis:</strong></p>
            <p>{movie.Plot}</p>
        </div>

      </div>

    </>
  );
};
