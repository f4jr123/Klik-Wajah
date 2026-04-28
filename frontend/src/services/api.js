import axios from 'axios';

// Konfigurasi URL - Hapus tanda miring "/" di ujung agar tidak double slash saat dipanggil
const NGROK_PYTHON_URL = "https://jerrell-impetrative-cullen.ngrok-free.dev";
const EXPRESS_BASE_URL = "http://localhost:3000/api";

const apiService = {
  /** * KE PYTHON (AI SERVER)
   */
  // Untuk registrasi (5 foto)
  processEmbeddings: (formData) => {
    return axios.post(`${NGROK_PYTHON_URL}/process-embeddings`, formData);
  },

  // Untuk verifikasi absensi (1 foto)
  verifyFaceAI: (formData) => {
    return axios.post(`${NGROK_PYTHON_URL}/verify-face`, formData);
  },

  /** * KE EXPRESS (BACKEND MYSQL)
   */
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
  },

  // --- INI FUNGSI YANG TADI HILANG ---
  submitAbsensi: (data) => {
    return axios.post(`${EXPRESS_BASE_URL}/absensi/submit-presensi`, data);
  }
};

export default apiService;