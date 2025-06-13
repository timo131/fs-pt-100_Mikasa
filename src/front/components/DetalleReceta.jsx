
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import recetaServices from "../services/recetaServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import DOMPurify from "dompurify";

export const DetalleReceta = () => {
  const { id } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [receta, setReceta] = useState(null);

  useEffect(() => {
    // If it’s not in the cache yet, fetch it and dispatch into the store
    if (!receta) {
      setLoading(true);
      recetaServices
        .getRecetaById(id)
        .then((data) => {
          dispatch({ type: "ADD_RECIPE", payload: data });
        })
        .catch((err) => console.error("Error fetching receta:", err))
        .finally(() => setLoading(false));
    }
  }, [id, receta, dispatch]);

  if (loading || !receta) {
    return <p>Cargando…</p>;
  }

  return (
    <div className="container mt-5">
      <h1>{receta.title}</h1>
      <p>{receta.cuisines?.[0]}</p>
      <p><strong>Porciones:</strong> {receta.servings}</p>
      <p><strong>Listo en:</strong> {receta.readyInMinutes} min.</p>
    <p><strong>Ingredientes:</strong></p>
        <ul>
          {receta.extendedIngredients.map((ingredient) => (
            <li key={ingredient.id || ingredient.name}>
              {ingredient.original}
            </li>
          ))}
        </ul>
      <p><strong>Valor nutricional:</strong> {receta.healthScore} %</p>
      <p><strong>Instrucciones:</strong> {receta.instructions}</p>
          {receta.image && receta.image !== "" && (
        <img src={receta.image} alt={receta.title} className="img-fluid mt-3" />
      )}
    </div>
  );
};
