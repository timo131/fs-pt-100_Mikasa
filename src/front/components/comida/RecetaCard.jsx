import { useEffect, useState } from "react";
import recetaServices from "../../services/recetaServices";
import "../../styles/Comida.css";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const RecetaCard = ({ id }) => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);

  const token = localStorage.getItem("token");
  const userId = store.user?.id;
  const receta = store.recetasById?.[id];

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

  if (loading || !receta) {
    return <div className="card m-2 p-3">Cargando…</div>;
  }

  const favoritos = store.user?.favorito_recetas || [];
  const recetasDeseadas = store.user?.deseado_recetas || {};

  const isFavorite = favoritos.some((fav) => fav.id === receta.id);
  const isLiked = recetasDeseadas.hasOwnProperty(receta.id);
  const currentRating = recetasDeseadas[receta.id] || null;

  const toggleFavorite = async () => {
    const updatedFavoritos = isFavorite
      ? favoritos.filter((r) => r.id !== receta.id)
      : [...favoritos, receta];

    dispatch({ type: "ADD_RECETA_FAVORITA", payload: receta });

    try {
      await fetch(`/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ favorito_recetas: updatedFavoritos }),
      });
    } catch (err) {
      console.error("Error updating favoritos:", err);
    }
  };

  const handleRatingChange = async (ratingValue) => {
    const updated = {
      ...recetasDeseadas,
      [receta.id]: ratingValue,
    };

    dispatch({
      type: "ADD_RECETA_DESEADA",
      payload: { id: receta.id, rating: ratingValue },
    });

    setShowRating(false);

    try {
      await fetch(`/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deseado_recetas: updated }),
      });
    } catch (err) {
      console.error("Error saving deseado_recetas:", err);
    }
  };

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

        <div className="d-flex justify-content-between mt-2">
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => navigate(`/comida/${receta.id}`)}
          >
            Detalles
          </button>
          <button
            className="btn btn-sm"
            onClick={toggleFavorite}
            title="Añadir a favoritos"
          >
            {isFavorite ? (
              <i className="fa-solid fa-heart text-danger"></i>
            ) : (
              <i className="fa-regular fa-heart"></i>
            )}
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setShowRating(true)}
            title="Quiero ver"
          >
            {isLiked ? (
              <i className="fa-solid fa-thumbs-up text-primary"></i>
            ) : (
              <i className="fa-regular fa-thumbs-up"></i>
            )}
          </button>
        </div>

        {showRating && (
          <div className="mt-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className="btn btn-sm mx-1"
                onClick={() => handleRatingChange(value)}
              >
                {{
                  1: "mehhh",
                  2: "no me apetece",
                  3: "ni fu ni fa",
                  4: "me apetece",
                  5: "me apetece mogollón",
                }[value]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
