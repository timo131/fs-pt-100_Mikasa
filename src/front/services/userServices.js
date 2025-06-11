import storeReducer from "../store";

const userServices = {};
const backendUrl = import.meta.env.VITE_BACKEND_URL;

userServices.register = async (formData) => {
  try {
    const resp = await fetch(backendUrl + "/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => null);
      throw new Error(text || resp.statusText);
    }
    const data = await resp.json();

    localStorage.setItem("token", data.token);

    console.log(data);
    return data;
  } catch (error) {
    console.error("Register failed:", error);
    throw error;
  }
};

userServices.join = async (formData) => {
  try {
    const resp = await fetch(backendUrl + "/api/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!resp.ok) throw Error("something went wrong");
    const data = await resp.json();

    localStorage.setItem("token", data.token);

    console.log(data);
    return data;
  } catch (error) {
    console.error("Join failed:", error);
    throw error;
  }
};

userServices.updateuser = async (userId, formData) => {
  try {
    const resp = await fetch(`${backendUrl}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(formData),
    });
    if (!resp.ok) throw Error("something went wrong");
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log("Update error:", error);
    throw error;
  }
};

userServices.updatehogar = async (hogarId, formData) => {
  try {
    const resp = await fetch(`${backendUrl}/api/hogares/${hogarId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(formData),
    });
    if (!resp.ok) throw Error("something went wrong");
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log("Update error:", error);
    throw error;
  }
};


userServices.login = async (formData) => {
  try {
    const resp = await fetch(`${backendUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await resp.json();

    if (!resp.ok) throw Error(data.error || "Something went wrong");

    localStorage.setItem('token', data.token)

    return data;

  } catch (error) {
    console.log("Login error:", error.message);
    throw error; 
  }
};

userServices.getUserInfo = async () => {
     try {
    const resp = await fetch(backendUrl + "/api/private", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    });
    if (!resp.ok) throw Error("something went wrong");
    const data = await resp.json();
    console.log(data)
    return data;
  } catch (error) {
    console.log(error);
  }
}

userServices.getUser = async (userId) => {
      try {
    const resp = await fetch(`${backendUrl}/api/users/${userId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    });
    if (!resp.ok) throw Error("Could not fetch user");
    const data = await resp.json();
    console.log(data)
    return data;
  } catch (error) {
    console.log(error);
  }
}

userServices.getHogar = async (hogarId) => {
     try {
    const resp = await fetch(`${backendUrl}/api/hogares/${hogarId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    });
    if (!resp.ok) throw Error("Could not fetch hogar");
    const data = await resp.json();
    console.log(data)
    return data;
  } catch (error) {
    console.log(error);
  }
}


export default userServices;
