import { useEffect, useState } from "react";
import "../../styles/Ocio.css"; // Asegurate que este archivo contenga los estilos necesarios

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
    <>
      <h3 className="text-center ivory text-outline">Películas y series</h3>

      {likes.length === 0 ? (
        <p>No hay películas guardadas aún.</p>
      ) : (
        <div className="movie-carousel mt-4">
          {likes.map((movie) => {
            const currentRating = ratings[movie.imdbID] || null;
            return (
              <div key={movie.imdbID} className="movie-card">
                {movie.Poster && movie.Poster !== "N/A" && (
                  <img src={movie.Poster} alt={movie.Title} />
                )}
                <h6>
                  {movie.Title} ({movie.Year})
                </h6>

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
                        name={`rating-${movie.imdbID}`}
                        id={`rating-${movie.imdbID}-${index}`}
                        value={label}
                        checked={currentRating === label}
                        disabled
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`rating-${movie.imdbID}-${index}`}
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
      )}
    </>
  );
};
