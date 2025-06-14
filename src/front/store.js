export const initialStore = () => {
  return {
    message: null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    hogar: JSON.parse(localStorage.getItem("hogar")) || null,
    token: localStorage.getItem("token") || null,
    tasks: JSON.parse(localStorage.getItem("tasks")) || [],
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

    default:
      throw new Error("Unknown action.");
  }
}
