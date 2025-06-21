export const initialStore = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (user) {
    user.favorito_recetas = [];
    user.deseado_recetas = {};
    localStorage.setItem("user", JSON.stringify(user));
  }

  const hogarString = localStorage.getItem("hogar");
  const hogar = hogarString ? JSON.parse(hogarString) : null;

  const tasksString = localStorage.getItem("tasks");
  const tasks = tasksString ? JSON.parse(tasksString) : [];

  return {
    message: null,
    user,
    hogar,
    token: localStorage.getItem("token") || null,
    recetasById: {},
    recetasSearch: [],
    tasks,
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

    case "set_hello": {
      const newTasks = [...(store.tasks || []), action.payload];
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return {
        ...store,
        tasks: newTasks,
      };
    }

    case "add_task": {
      const newTasks = [...(store.tasks || []), action.payload];
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return {
        ...store,
        tasks: newTasks,
      };
    }

    case "delete_task": {
      const newTasks = store.tasks.filter((_, i) => i !== action.payload);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return {
        ...store,
        tasks: newTasks,
      };
    }

    case "edit_task": {
      const newTasks = store.tasks.map((task, i) =>
        i === action.payload.index ? action.payload.updatedTask : task
      );
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return {
        ...store,
        tasks: newTasks,
      };
    }

    case "toggle_task_done": {
      const newTasks = store.tasks.map((task, i) =>
        i === action.payload ? { ...task, hecha: !task.hecha } : task
      );
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return {
        ...store,
        tasks: newTasks,
      };
    }

    case "SET_RECETA_SEARCH_RESULTS":
      return {
        ...store,
        recetasSearch: action.payload.map((r) => r.id),
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

    case "UPDATE_RECETA_FAVORITA":
      const updatedUser = {
        ...store.user,
        favorito_recetas: action.payload,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return {
        ...store,
        user: updatedUser,
      };

    case "ADD_RECETA_DESEADA":
      const currentRating = store.user?.deseado_recetas?.[action.payload.id];
      if (currentRating === action.payload.rating) return store;
      return {
        ...store,
        user: {
          ...store.user,
          deseado_recetas: {
            ...(store.user?.deseado_recetas || {}),
            [action.payload.id]: action.payload.rating,
          },
        },
        hogar: {
          ...store.hogar,
          users: store.hogar.users.map((u) =>
            u.id === store.user.id
              ? {
                  ...u,
                  deseado_recetas: {
                    ...(u.deseado_recetas || {}),
                    [action.payload.id]: action.payload.rating,
                  },
                }
              : u
          ),
        },
  }
}
}