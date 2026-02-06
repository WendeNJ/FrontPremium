import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true, // 🔥 ESSENCIAL
  headers: {
    "Content-Type": "application/json",
  },
});


// 🔹 Criar nova manifestação
export function criarManifestacao(data) {
  return api.post("/manifestacoes", data);
}


// 🔹 Consultar manifestação por protocolo
// 🔹 Consultar manifestação por protocolo
export function consultarPorProtocolo(protocolo) {
  return api.get(`/manifestacoes/protocolo/${protocolo}`);
}

// 🔹 Configuração da ouvidoria (Sobre)
export function getConfiguracaoOuvidoria() {
  return api.get("/configuracao-ouvidoria").then(res => res.data);
}
// Função para enviar com arquivo
export function criarManifestacaoComArquivo(formData) {
  return api.post("/manifestacoes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export default api;
