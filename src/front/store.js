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
