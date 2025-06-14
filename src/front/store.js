export const initialStore = () => {
  return {
    message: null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    hogar: JSON.parse(localStorage.getItem("hogar")) || null,
    token: localStorage.getItem("token") || null,
    recetasByID: {},
    recetasSearch: []
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "login_success":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("hogar", JSON.stringify(action.payload.hogar));
      return {
        ...store,
        user: action.payload.user,
        hogar: action.payload.hogar,
        token: action.payload.token,
      };
    case "logout":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("hogar");
      return initialStore();
    case "update_user":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...store,
        user: action.payload,
      };
    case "update_member":
      localStorage.setItem("hogar", JSON.stringify(action.payload));
      return {
        ...store,
        hogar: {
          ...store.hogar,
          users: store.hogar.users.map((u) =>
            u.id === action.payload.id ? action.payload : u
          ),
        },
      };
    case "remove_member":
      localStorage.setItem("hogar", JSON.stringify(action.payload));
      return {
        ...store,
        hogar: {
          ...store.hogar,
          users: store.hogar.users.filter((u) => u.id !== action.payload),
        },
      };
    case "update_hogar":
      localStorage.setItem("hogar", JSON.stringify(action.payload));
      return {
        ...store,
        hogar: action.payload,
      };
    case "set_hello":
      return {
        ...store,
        tasks: [...store.tasks, action.payload],
      };
    case "add_task":
      return {
        ...store,
        tasks: [...(store.tasks || []), action.payload],
      };

    case "delete_task":
      return {
        ...store,
        tasks: store.tasks.filter((_, i) => i !== action.payload),
      };

    case "edit_task":
      return {
        ...store,
        tasks: store.tasks.map((task, i) =>
          i === action.payload.index ? action.payload.updatedTask : task
        ),
      };
    case "toggle_task_done":
      return {
        ...store,
        tasks: store.tasks.map((task, i) =>
          i === action.payload ? { ...task, hecha: !task.hecha } : task
        ),
      };

    case "SET_RECETA_SEARCH_RESULTS":
      return {
        ...store,
        recetasSearch: action.payload.map(r => r.id),
        recetasById: {
          ...store.recetasById,
          ...action.payload.reduce((acc, r) => {
            acc[r.id] = r;
            return acc;
          }, {}),
        },
      };

    case "ADD_RECETA":
      return {
        ...store,
        recetasById: {
          ...store.recetasById,
          [action.payload.id]: action.payload,
        },
      };

    case "ADD_RECETA_FAVORITA":
        const updatedFavoritos = [
          ...(state.user?.favorito_recetas || []),
          action.payload,
        ];
      return {
        ...store,
        user: {
          ...store.user,
          favorito_recetas: updatedFavoritos
        }
      };

    case "ADD_RECETA_DESEADA":
      return {
        ...store,
        user: {
          ...store.user,
          deseado_recetas: {
            ...(store.hogar?.deseado_recetas || {}),
            [action.payload.id]: action.payload.rating,
          }
        }
      };

    default:
      throw new Error("Unknown action.");
  }
}
