import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieById } from "../services/omdbApi";

export const Detalle = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const loadMovie = async () => {
      const data = await getMovieById(id);
      setMovie(data);
    };
    loadMovie();
  }, [id]);

  if (!movie) return <p>Cargando...</p>;

  return (
    <div className="container mt-5">
      <h1>{movie.Title}</h1>
      <p><strong>Año:</strong> {movie.Year}</p>
      <p><strong>Género:</strong> {movie.Genre}</p>
      <p><strong>Director:</strong> {movie.Director}</p>
      <p><strong>Reparto:</strong> {movie.Actors}</p>
      <p><strong>Sinopsis:</strong> {movie.Plot}</p>
      <p><strong>IMDB:</strong> {movie.imdbRating}</p>
      {movie.Poster && movie.Poster !== "N/A" && (
        <img src={movie.Poster} alt={movie.Title} className="img-fluid mt-3" />
      )}
    </div>
  );
};
