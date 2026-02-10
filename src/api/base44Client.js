const API_BASE_URL = "http://localhost:8081";

async function request(endpoint, method = "GET", body = null) {
  const options = {
    method,
    credentials: "include", // 🔥 Equivalente ao withCredentials do axios
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

// ============================================
// 📌 EXPORT COMPATÍVEL COM CÓDIGO ANTIGO
// ============================================
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
      login: (credentials) => request(`/users/login`, "POST", credentials),
      logout: () => request(`/users/logout`, "POST"),
      testAuth: () => request(`/users/test/administrator`),
    },

    Respostas: {
      list: () => request(`/respostas`),
      create: (data) => request(`/respostas`, "POST", data),
      update: (id, data) => request(`/respostas/${id}`, "PUT", data),
      delete: (id) => request(`/respostas/${id}`, "DELETE"),
    },

    Manifestacoes: {
      list: () => request(`/manifestacoes`),
      consultarPorProtocolo: (protocolo) => request(`/manifestacoes/protocolo/${protocolo}`),
      create: (data) => request(`/manifestacoes`, "POST", data),
      update: (id, data) => request(`/manifestacoes/${id}`, "PUT", data),
      delete: (id) => request(`/manifestacoes/${id}`, "DELETE"),
    },

    CardMural: {
      list: () => request(`/api/cards`),
      getById: (id) => request(`/api/cards/${id}`),
      listByType: (tipo) => request(`/api/cards/tipo/${tipo}`),
      create: (data) => request(`/api/cards`, "POST", data),
      update: (id, data) => request(`/api/cards/${id}`, "PUT", data),
      delete: (id) => request(`/api/cards/${id}`, "DELETE"),
    },

    Noticia: {
      list: () => request(`/api/noticias`),
      getById: (id) => request(`/api/noticias/${id}`),
      create: (data) => request(`/api/noticias`, "POST", data),
      update: (id, data) => request(`/api/noticias/${id}`, "PUT", data),
      delete: (id) => request(`/api/noticias/${id}`, "DELETE"),
    },
  },
};