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
      createComArquivo: async (formData) => {
        const res = await fetch(`${API_BASE_URL}/manifestacoes/com-arquivo`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erro na API: ${res.status} - ${text}`);
        }
        return res.json();
      },
      
      atualizarStatus: (protocolo, status, resposta) => {
        let url = `/manifestacoes/${protocolo}/status?status=${status}`;
        if (resposta) {
          url += `&resposta=${encodeURIComponent(resposta)}`;
        }
        return request(url, "PATCH");
      },
      
      update: (id, data) => {
        console.warn('⚠️ update() está obsoleto! Use atualizarStatus(protocolo, status, resposta)');
        return request(`/manifestacoes/${id}`, "PUT", data);
      },
      delete: (id) => request(`/manifestacoes/${id}`, "DELETE"),
    },

    // ============================================
    // 📌 NOVOS ENDPOINTS DE UPLOAD (BASE44)
    // ============================================
    Upload: {
      // Upload de imagem para notícias/cards
      imagem: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE_URL}/upload/imagem`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erro no upload: ${res.status} - ${text}`);
        }
        return res.json(); // Retorna { url: "/uploads/imagens/uuid.jpg" }
      },
      
      // Upload de anexo para manifestações
      anexo: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE_URL}/upload/anexo`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erro no upload: ${res.status} - ${text}`);
        }
        return res.json(); // Retorna { url: "/uploads/anexos/uuid.pdf", nome: "original.pdf" }
      },
      
      // Deletar imagem
      deletar: (caminho) => request(`/upload/imagem?caminho=${encodeURIComponent(caminho)}`, "DELETE"),
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

    Estatisticas: {
      get: () => request(`/api/estatisticas`),
    },

    Auditores: {
      list:   ()     => request(`/api/ouvidoria/auditores`),
      add:    (data) => request(`/api/ouvidoria/auditores`, "POST", data),
      remove: (id)   => request(`/api/ouvidoria/auditores/${id}`, "DELETE"),
    },
  },
};

export default api;
