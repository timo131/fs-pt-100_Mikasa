import useGlobalReducer from "../../hooks/useGlobalReducer"
import { MovieCard } from "../ocio/MovieCard"

export const OcioHogar = () => {

    const { store, dispatch } = useGlobalReducer()
    const ratingSums = {};

    store.hogar?.users?.forEach(user => {
        const ratings = user.deseado_peliculas || {};
        Object.entries(ratings).forEach(([movieId, rating]) => {
            ratingSums[movieId] = (ratingSums[movieId] || 0) + rating;
        });
    });

    const sortedMovieIds = Object.entries(ratingSums)
        .filter(([, sum]) => sum > 0)
        .sort(([, aRating], [, bRating]) => bRating - aRating)
        .map(([id]) => id);

    return (
        <>
            <h3 className="text-center ivory text-outline">Películas y series</h3><p className="text-center charcoal">ordenadas por preferencia del hogar</p>
            {sortedMovieIds.length > 0 ? (
                <div className="search-results mt-4">
                    <div className="row g-3 justify-content-center">
                        {sortedMovieIds.map((id) => (
                            <div
                                key={id}
                                className="col-12 col-md-6 col-lg-6 h-100 d-flex justify-content-center"
                            >
                                <MovieCard id={id} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
        <p className="text-center mt-4">Nadie ha marcado películas o series todavía.</p>
      )}
        </>
    )
}