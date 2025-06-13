

import { useEffect, useState } from "react";
import recetaServices from "../../services/recetaServices";
import "../../styles/Comida.css";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const RecetaCard = ({ id }) => {
    const { store, dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(false);

    let receta = store.recipesById[id];

  useEffect(() => {
    if (!receta) {
      setLoading(true);
      recetaServices.getRecetaById(id)
        .then((data) => {
          dispatch({ type: "ADD_RECETA", payload: data });
        })
        .catch((err) => {
          console.error("Error fetching receta:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, receta, dispatch]);

    if (loading || !store.recipesById[id]) {
        return <div className="card m-2 p-3">Cargando…</div>;
    }

    return (
        <div className="receta-card m-2">
            {receta.image && (
                <img src={receta.image} alt={receta.title} className="card-img-top" />
            )}
            <div className="card-body">
                <h5 className="card-title">{receta.title}</h5>
                <p>{receta.cuisines?.[0]}</p>
                <p><strong>Porciones:</strong> {receta.servings}</p>
                <p><strong>Listo en:</strong> {receta.readyInMinutes} min.</p>
                <p><strong>Valor nutricional:</strong> {receta.healthScore} %</p>
            </div>
        </div>
    );
};
