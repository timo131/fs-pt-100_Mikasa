import { useEffect, useState } from "react";
import recetaServices from "../../services/recetaServices";
import userServices from "../../services/userServices";
import "../../styles/Comida.css";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { Rating } from "../modals/rating";

export const RecetaCard = ({ id }) => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);

  const token = localStorage.getItem("token");
  const userId = store.user?.id;
  const receta = store.recetasById?.[id];

  useEffect(() => {
    if (!store.recetasById?.[id]) {
      recetaServices.getRecetaById(id)
        .then((data) => {
          if (data) {
            dispatch({ type: "ADD_RECETA", payload: data });
          }
        })
        .catch((err) => {
          console.error("Error fetching receta:", err);
        });
    }
  }, [id, store.recetasById, dispatch]);

  if (loading || !receta) {
    return <div className="card m-2 p-3">Cargando…</div>;
  }

  const favoritos = store.user?.favorito_recetas || [];
  const recetasDeseadas = store.user?.deseado_recetas || {};

  const isFavorite = favoritos.includes(receta.id);
  const isLiked = recetasDeseadas.hasOwnProperty(receta.id);
  const currentRating = recetasDeseadas[receta.id] || null;

  const toggleFavorite = async () => {
    const isAlreadyFavorite = favoritos.includes(receta.id);
    const updatedFavoritos = isAlreadyFavorite
      ? favoritos.filter((id) => id !== receta.id)
      : [...favoritos, receta.id];

    dispatch({ type: "UPDATE_RECETA_FAVORITA", payload: updatedFavoritos });
    try {
      await userServices.updateuser(userId, { favorito_recetas: updatedFavoritos });
    } catch (err) {
      console.error("Error updating favoritos:", err);
    }
  };

  const handleRatingChange = async (ratingValue) => {
    const current = recetasDeseadas[receta.id];
    if (current === ratingValue) return;
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
      await userServices.updateuser(userId, { deseado_recetas: updated });
    } catch (err) {
      console.error("Error saving deseado_recetas:", err);
    }
    setTimeout(() => document.activeElement.blur(), 0);
  };


  return (
    <>
      <div className="receta-card m-2">

        <div className="card-body small d-flex flex-column justify-content-between h-100" onClick={() => navigate(`/comida/${receta.id}`)}>
          <div className="d-flex flex-column justify-content-between h-100">
            <div className="d-flex align-items-center justify-content-center h-100">

              <h6 className="card-title text-center fw-bold m-0">{receta.title}</h6>
            </div>
            <p className="text-center mb-0">{receta.cuisines?.[0]}</p>
            <div className="d-flex flex-row justify-content-center align-items-center gap-3 ms-1">
              <div><span className="fa-solid charcoal fa-users me-2"></span>{receta.servings}</div>
              <div><span className="fa-regular charcoal fa-clock me-2"></span>{receta.readyInMinutes} min</div>
              <div><span className="fa-solid charcoal fa-apple-whole me-2"></span>{receta.healthScore} %</div>
            </div>
            <div className="text-center mt-2">
              {receta.image && (
                <img src={receta.image} alt={receta.title} />
              )}
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-around align-items-center mt-2">
          <button className="btn btn-sm" data-bs-toggle="modal" data-bs-target={`#ratingModal-${id}`} title="Me gusta">
            <span className={`fa-${isLiked ? "solid" : "regular"} fa-thumbs-up text-outline fa-2x
              ${currentRating <= 0
                ? "ochre"
                : "sage"
              }`}></span>
          </button>
          <button className="btn btn-sm" onClick={toggleFavorite} title="Favorito">
            <span className={`fa fa-${isFavorite ? "solid" : "regular"} fa-heart text-outline fa-2x coral`}></span>
          </button>
        </div>
      </div>
        <Rating id={id} onRate={handleRatingChange} />
    </>
    );
  };
