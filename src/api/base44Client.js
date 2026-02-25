import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para tratar erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Não autenticado");
    }
    return Promise.reject(error);
  }
);

// ============================================
// 🔹 MANIFESTAÇÕES (funções legacy)
// ============================================
export function criarManifestacao(data) {
  return api.post("/manifestacoes", data);
}

export function criarManifestacaoComArquivo(formData) {
  return api.post("/manifestacoes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function consultarPorProtocolo(protocolo) {
  return api.get(`/manifestacoes/protocolo/${protocolo}`);
}

export function atualizarStatusPorProtocolo(protocolo, status) {
  return api.patch(`/manifestacoes/${protocolo}/status?status=${status}`);
}

export function getConfiguracaoOuvidoria() {
  return api.get("/configuracao-ouvidoria").then(res => res.data);
}

export function updateConfiguracaoOuvidoria(data) {
  return api.put("/configuracao-ouvidoria", data).then(res => res.data);
}

// ============================================
// 📌 MANIFESTAÇÕES API (objeto completo)
// ============================================
export const manifestacoesAPI = {
  list: () => api.get("/manifestacoes").then(res => res.data),
  consultarPorProtocolo: (protocolo) => api.get(`/manifestacoes/protocolo/${protocolo}`).then(res => res.data),
  create: (data) => api.post("/manifestacoes", data).then(res => res.data),
  createComArquivo: (formData) => api.post("/manifestacoes", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(res => res.data),
  atualizarStatus: (protocolo, status) =>
    api.patch(`/manifestacoes/${protocolo}/status?status=${status}`).then(res => res.data),
  update: (id, data) => {
    console.warn('⚠️ update() está obsoleto! Use atualizarStatus(protocolo, status)');
    return api.put(`/manifestacoes/${id}`, data).then(res => res.data);
  },
  delete: (id) => api.delete(`/manifestacoes/${id}`),
};

// ============================================
// 📌 UNIDADES
// ============================================
export const unidadesAPI = {
  get: (id) => api.get(`/unidades/${id}`).then(res => res.data),
  list: () => api.get("/unidades").then(res => res.data),
  create: (data) => api.post("/unidades", data).then(res => res.data),
  update: (id, data) => api.put(`/unidades/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/unidades/${id}`),
};

// ============================================
// 📌 CATEGORIAS
// ============================================
export const categoriasAPI = {
  get: (id) => api.get(`/categorias/${id}`).then(res => res.data),
  list: () => api.get("/categorias").then(res => res.data),
  create: (data) => api.post("/categorias", data).then(res => res.data),
  update: (id, data) => api.put(`/categorias/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/categorias/${id}`),
};

// ============================================
// 📌 USERS
// ============================================
export const usersAPI = {
  list: () => api.get("/users").then(res => res.data),
  create: (data) => api.post("/users", data).then(res => res.data),
  update: (id, data) => api.put(`/users/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/users/${id}`),
  login: (credentials) => api.post("/users/login", credentials).then(res => res.data),
  logout: () => api.post("/users/logout"),
  testAuth: () => api.get("/users/test/administrator").then(res => res.data),
};

// ============================================
// 📌 RESPOSTAS
// ============================================
export const respostasAPI = {
  list: () => api.get("/respostas").then(res => res.data),
  create: (data) => api.post("/respostas", data).then(res => res.data),
  update: (id, data) => api.put(`/respostas/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/respostas/${id}`),
};

// ============================================
// 📌 CARDS DO MURAL - COM /api ✅
// ============================================
export const cardMuralAPI = {
  list: () => api.get("/api/cards").then(res => res.data),
  getById: (id) => api.get(`/api/cards/${id}`).then(res => res.data),
  listByType: (tipo) => api.get(`/api/cards/tipo/${tipo}`).then(res => res.data),
  create: (data) => api.post("/api/cards", data).then(res => res.data),
  update: (id, data) => api.put(`/api/cards/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/api/cards/${id}`),
};

// ============================================
// 📌 NOTÍCIAS - COM /api ✅
// ============================================
export const noticiasAPI = {
  list: () => api.get("/api/noticias").then(res => res.data),
  getById: (id) => api.get(`/api/noticias/${id}`).then(res => res.data),
  create: (data) => api.post("/api/noticias", data).then(res => res.data),
  update: (id, data) => api.put(`/api/noticias/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/api/noticias/${id}`),
};

// ============================================
// 📌 CONFIGURAÇÃO DA OUVIDORIA
// ============================================
export const configuracaoAPI = {
  get: () => api.get("/configuracao-ouvidoria").then(res => res.data),
  update: (data) => api.put("/configuracao-ouvidoria", data).then(res => res.data),
};

// ============================================
// 📌 ESTATÍSTICAS - COM /api ✅
// ============================================
export const estatisticasAPI = {
  get: () => api.get("/api/estatisticas").then(res => res.data),
};

// ============================================
// 📌 AUDITORES ✅
// ============================================
export const auditoresAPI = {
  list:   ()     => api.get("/api/ouvidoria/auditores").then(res => res.data),
  add:    (data) => api.post("/api/ouvidoria/auditores", data).then(res => res.data),
  remove: (id)   => api.delete(`/api/ouvidoria/auditores/${id}`).then(res => res.data),
};

// ============================================
// 📌 FUNÇÃO REQUEST PARA FETCH NATIVO
// ============================================
async function request(endpoint, method = "GET", body = null) {
  const options = {
    method,
    credentials: "include",
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
// 📌 EXPORT COMPATÍVEL COM CÓDIGO ANTIGO (base44)
// ============================================
export const base44 = {
  entities: {
    // Rotas SEM /api
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
      atualizarStatus: (protocolo, status) =>
        request(`/manifestacoes/${protocolo}/status?status=${status}`, "PATCH"),
      update: (id, data) => {
        console.warn('⚠️ update() está obsoleto! Use atualizarStatus(protocolo, status)');
        return request(`/manifestacoes/${id}`, "PUT", data);
      },
      delete: (id) => request(`/manifestacoes/${id}`, "DELETE"),
    },

    // Rotas COM /api
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

    Estatisticas: {
      get: () => request(`/api/estatisticas`),
    },

    // ✅ AUDITORES
    Auditores: {
      list:   ()     => request(`/api/ouvidoria/auditores`),
      add:    (data) => request(`/api/ouvidoria/auditores`, "POST", data),
      remove: (id)   => request(`/api/ouvidoria/auditores/${id}`, "DELETE"),
    },
  },
};

export default api;
