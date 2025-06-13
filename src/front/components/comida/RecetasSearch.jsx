import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useState, useEffect } from "react";
import recetaServices from "../../services/recetaServices";
import { RecetaCard } from "./RecetaCard"
import "../../styles/Comida.css";

export const RecetasSearch = () => {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const { store, dispatch } = useGlobalReducer()

    useEffect(() => {
        recetaServices.searchRecetas(query).then(results => {
            // …
        });
    }, [query]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        const recetas = await recetaServices.searchRecetas(query);
        dispatch({ type: "SET_RECETA_SEARCH_RESULTS", payload: recetas });
    };

    return (
        <>
            <h3 className="text-center">Recetas Search</h3>
            <form className="d-flex" role="search" onSubmit={handleSearch}>
                <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Busca recetas o ingredientes"
                    aria-label="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-outline-success" type="submit">
                    Buscar
                </button>
            </form>
            {results.length > 0 && (
                <div className="search-results mt-4">
                    <div className="receta-carousel">
                        {results.map(receta => (
                            <RecetaCard key={receta.id} id={receta.id}/>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}