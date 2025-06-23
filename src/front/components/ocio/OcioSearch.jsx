import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useState, useEffect } from "react";
import omdbApi from "../../services/omdbApi";
import { MovieCard } from "./MovieCard";
import "../../styles/Ocio.css";
import { useRef } from "react";


export const OcioSearch = () => {
    const [query, setQuery] = useState("");
    const { store, dispatch } = useGlobalReducer()

    const carouselRef = useRef(null);

    const scrollCarousel = (direction) => {
    const container = carouselRef.current;
    const scrollAmount = 300;
    if (!container) return;

        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const loadDefaultMovies = async () => {
            const searchResults = await omdbApi.searchMovies("movie");
            const detailedMovies = await Promise.all(
                searchResults.map(async (m) => {
                    const movieData = await omdbApi.getMovieById(m.imdbID);
                    return {
                        id: movieData.imdbID,
                        title: movieData.Title,
                        image: movieData.Poster !== "N/A" ? movieData.Poster : null,
                        year: movieData.Year,
                        genre: movieData.Genre,
                        imdbRating: movieData.imdbRating
                    };
                })
            );
            dispatch({ type: "SET_MOVIE_SEARCH_RESULTS", payload: detailedMovies });
        };

        loadDefaultMovies();
    }, [dispatch]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const searchResults = await omdbApi.searchMovies(query);
        const detailedMovies = await Promise.all(
            searchResults.map(async (m) => {
                const movieData = await omdbApi.getMovieById(m.imdbID);
                return {
                    id: movieData.imdbID,
                    title: movieData.Title,
                    image: movieData.Poster !== "N/A" ? movieData.Poster : null,
                    year: movieData.Year,
                    genre: movieData.Genre,
                    imdbRating: movieData.imdbRating
                };
            })
        );

        dispatch({ type: "SET_MOVIE_SEARCH_RESULTS", payload: detailedMovies });
    };


    return (
        <>
            <h3 className="text-center ivory text-outline">Búsqueda de películas y series</h3>
            <form className="d-flex" onSubmit={handleSearch}>
                <input className="form-control me-2" placeholder="Buscar..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <button className="search-movies-button" type="submit">Buscar</button>
            </form>

            {store.moviesSearch?.length > 0 && (
                <div className="search-results mt-4">
                    <div className="carousel-wrapper position-relative">
                        <button className="scroll-btn left" onClick={() => scrollCarousel("left")}>
                            <span className="fa-solid fa-circle-chevron-left"></span>
                        </button>
                        <div className="movie-carousel" ref={carouselRef}>
                            {store.moviesSearch.map(id => (
                                <div key={id} className="row">
                                    <div key={id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                        <MovieCard id={id} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="scroll-btn right" onClick={() => scrollCarousel("right")}>
                            <span className="fa-solid fa-circle-chevron-right"></span>
                        </button>
                    </div>
                </div>
            )}


        </>
    );
};
