import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useState, useEffect } from "react";
import recetaServices from "../../services/recetaServices";
import { RecetaCard } from "./RecetaCard"
import "../../styles/Comida.css";
import "../../index.css";

export const RecetasSearch = () => {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const { store, dispatch } = useGlobalReducer()

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        const recetas = await recetaServices.searchRecetas(query);
        console.log("Fetched recetas:", recetas);
        dispatch({ type: "SET_RECETA_SEARCH_RESULTS", payload: recetas });
    };

    return (
        <>
            <h3 className="text-center ivory text-outline">Búsqueda de recetas</h3>
            <form className="d-flex" role="search" onSubmit={handleSearch}>
                <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Busca recetas o ingredientes"
                    aria-label="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="search-recetas-button" type="submit">
                    Buscar
                </button>
            </form>
            {store.recetasSearch.length > 0 && (
                <div className="search-results mt-4">
                    <div className="row g-3 justify-content-center">
                        {store.recetasSearch?.map(id => (
                            <div
                                key={id}
                                className="col-12 col-sm-6 col-md-4 col-lg-3"
                            >
                                <RecetaCard id={id} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}