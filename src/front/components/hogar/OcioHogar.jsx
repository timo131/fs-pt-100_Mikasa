import { useEffect, useState } from "react";
import "../../styles/Ocio.css";

export const OcioHogar = () => {
  const [likes, setLikes] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const storedLikes = localStorage.getItem("likes");
    if (storedLikes) setLikes(JSON.parse(storedLikes));

    const storedRatings = localStorage.getItem("ratings");
    if (storedRatings) setRatings(JSON.parse(storedRatings));
  }, []);

  return (
    <div className="container-ocio">
       <h3  className="text-center ivory text-outline">Peliculas y Series</h3>

      {likes.length === 0 ? (
        <p className="text-center">No hay películas guardadas aún.</p>
      ) : (
        <div className="movie-carousel mt-4">
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
                  ? `¿Quieres ver la pelicula?  ${ratings[movie.imdbID]}`
                  : "Sin valorar"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
