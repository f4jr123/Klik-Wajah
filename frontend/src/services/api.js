import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// ========== Karyawan ==========

export const getKaryawanPrepareAdd = () => {
  return api.get('/karyawan/prepare-add')
}

export const tambahKaryawan = (data) => {
  return api.post('/karyawan/tambah', data)
}

// ========== General ==========

export default api
