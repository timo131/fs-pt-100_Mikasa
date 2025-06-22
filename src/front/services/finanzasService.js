const finanzasService = {};
const backendUrl = import.meta.env.VITE_BACKEND_URL;


finanzasService.getFinanzas = async (token) => {
  const res = await fetch(`${backendUrl}/api/finanzas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error en getFinanzas:", res.status, text);
    throw new Error(text);
  }

  return await res.json();
};

finanzasService.getPagos = async (token) => {
  const res = await fetch(`${backendUrl}/api/pagos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error en getPagos:", res.status, text);
    throw new Error(text);
  }

  return await res.json();
};

finanzasService.postGasto = async (token, gasto) => {
  const hogar_id = localStorage.getItem("hogar_id");

  if (!hogar_id) {
    console.error("hogar_id no está definido en localStorage");
    throw new Error("hogar_id no disponible");
  }

  const payload = {
    ...gasto,
    hogar_id: parseInt(hogar_id),
  };
 

  const res = await fetch(`${backendUrl}/api/pagos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error en postGasto:", res.status, text);
    throw new Error(text);
  }

  return await res.json();
};

finanzasService.marcarComoPagado = async (token, userPagoId, estado) => {
  const res = await fetch(`${backendUrl}/api/user_pagos/${userPagoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado }),
  });

  if (!res.ok) {
    throw new Error("Error al marcar como pagado");
  }
  return await res.json();
};

finanzasService.getUsuarios = async (token) => {
  const res = await fetch(`${backendUrl}/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error en getUsuarios:", res.status, text);
    throw new Error("Error al obtener los usuarios");
  }

  return await res.json();
};
finanzasService.eliminarGasto = async (id, token) => {
  const response = await fetch(`${backendUrl}/api/pagos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el gasto");
  }
};

export default finanzasService;