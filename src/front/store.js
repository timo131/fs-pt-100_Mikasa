

export const initialStore=()=>{
  return{
    message: null,
    user: null,
    hogar: null
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'login_success':
      return {
        ...store,
        user:  action.payload.user,
        hogar:  action.payload.hogar
      };
    case 'logout':
      return initialStore();
    case 'update_user':
      return {
        ...store,
        user:  action.payload,
      };
    case 'update_member':
      return {
        ...store,
        hogar: {
          ...store.hogar,
          user: store.hogar.user.map(u =>
            u.id === action.payload.id ? action.payload : u
          )
        }
      };
    case "remove_member":
      return {
        ...store,
        hogar: {
          ...store.hogar,
          user: store.hogar.user.filter(u => u.id !== action.payload)
        }
      };
    case 'update_hogar':
      return {
        ...store,
        hogar:  action.payload,
      };
    case 'set_hello':
      return {
        ...store,
        tasks: [...store.tasks, action.payload],
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
      i === action.payload
        ? { ...task, hecha: !task.hecha }
        : task
    ),
  };


    default:
      throw new Error("Unknown action.");
  }
}
