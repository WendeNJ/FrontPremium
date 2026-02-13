import axios from "axios";



const API_BASE_URL = import.meta.env.VITE_API_URL;

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
      // window.location.href = '/admin';
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
  update: (id, data) => api.put(`/manifestacoes/${id}`, data).then(res => res.data),
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
  
  // Autenticação
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
// 📌 CARDS DO MURAL
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
// 📌 NOTÍCIAS 🔥 CONECTADO!
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
// 📌 ESTATÍSTICAS
// ============================================
export const estatisticasAPI = {
  get: () => api.get("/api/estatisticas").then(res => res.data),
};

export default api;