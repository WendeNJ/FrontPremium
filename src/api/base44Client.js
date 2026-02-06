const API_BASE_URL = "http://localhost:8081"; // backend local

async function request(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro na API: ${res.status} - ${text}`);
  }

  return res.status !== 204 ? res.json() : null;
}

export const base44 = {
  entities: {
    Unidades: {
      get: (id) => request(`/unidades/${id}`),
      list: () => request(`/unidades`),
      create: (data) => request(`/unidades`, "POST", data),
      update: (id, data) => request(`/unidades/${id}`, "PUT", data),
      delete: (id) => request(`/unidades/${id}`, "DELETE"),
    },

    Categorias: {
      get: (id) => request(`/categorias/${id}`),
      list: () => request(`/categorias`),
      create: (data) => request(`/categorias`, "POST", data),
      update: (id, data) => request(`/categorias/${id}`, "PUT", data),
      delete: (id) => request(`/categorias/${id}`, "DELETE"),
    },

    Users: {
      list: () => request(`/users`),
      create: (data) => request(`/users`, "POST", data),
      update: (id, data) => request(`/users/${id}`, "PUT", data),
      delete: (id) => request(`/users/${id}`, "DELETE"),
    },

    Respostas: {
      list: () => request(`/respostas`),
      create: (data) => request(`/respostas`, "POST", data),
      update: (id, data) => request(`/respostas/${id}`, "PUT", data),
      delete: (id) => request(`/respostas/${id}`, "DELETE"),
    },

    Manifestacoes: {
  list: () => request(`/manifestacoes`),

  consultarPorProtocolo: (protocolo) =>
    request(`/manifestacoes/protocolo/${protocolo}`),

  create: (data) =>
    request(`/manifestacoes`, "POST", data),

  update: (id, data) =>
    request(`/manifestacoes/${id}`, "PUT", data),

  delete: (id) =>
    request(`/manifestacoes/${id}`, "DELETE"),
},
  },
};