import axios from 'axios';

// Konfigurasi URL
const NGROK_PYTHON_URL = "https://jerrell-impetrative-cullen.ngrok-free.dev";
const EXPRESS_BASE_URL = "http://localhost:3000/api";

const apiService = {
  // Ke Python (AI)
  processEmbeddings: (formData) => {
    return axios.post(`${NGROK_PYTHON_URL}/process-embeddings`, formData);
  },

  // Ke Express (Backend Utama)
  getDivisi: () => {
    return axios.get(`${EXPRESS_BASE_URL}/karyawan/prepare-add`);
  },

  saveKaryawan: (formData) => {
    return axios.post(`${EXPRESS_BASE_URL}/karyawan/tambah`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getEmbeddings: () => {
    return axios.get(`${EXPRESS_BASE_URL}/karyawan/embeddings`);
  }
};

export default apiService;