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
  const res = await fetch(`${backendUrl}/api/pagos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(gasto),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error en postGasto:", res.status, text);
    throw new Error(text);
  }

  return await res.json();
};
finanzasService.marcarComoPagado = async (token, pagoId) => {
  const res = await fetch(`${backendUrl}/api/pagos/${pagoId}/pagar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
};
finanzasService.getUsuarios = async() => {
  getUsuarios: async (token) => {
    const res = await fetch(`${backendUrl}/api/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error al obtener los usuarios");
    }

    return await res.json();
  }
}

export default finanzasService;