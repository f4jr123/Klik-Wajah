import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'
import './DaftarKaryawan.css'

function DaftarKaryawan() {
  const [karyawanList, setKaryawanList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchKaryawan()
  }, [])

  const fetchKaryawan = async () => {
    try {
      const res = await api.get('/karyawan')
      if (res.data) {
        setKaryawanList(Array.isArray(res.data) ? res.data : [])
      }
    } catch (err) {
      setError('Gagal memuat data karyawan. Pastikan backend berjalan.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div className="daftar-karyawan">
      <div className="page-header">
        <h1>Daftar Karyawan</h1>
        <Link to="/tambah-karyawan" className="btn btn-primary btn-sm" id="btn-goto-tambah">
          ➕ Tambah Baru
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">❌ {error}</div>
      )}

      {!error && karyawanList.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📋</div>
          <h3>Belum Ada Data</h3>
          <p>Belum ada karyawan yang terdaftar. Mulai dengan menambahkan karyawan baru.</p>
          <Link to="/tambah-karyawan" className="btn btn-primary mt-2">
            ➕ Tambah Karyawan Pertama
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>ID Karyawan</th>
                <th>Nama</th>
                <th>Divisi</th>
                <th>Status Wajah</th>
              </tr>
            </thead>
            <tbody>
              {karyawanList.map((k, index) => (
                <tr key={k.id || index}>
                  <td>{index + 1}</td>
                  <td>
                    <span className="id-badge">{k.id_karyawan}</span>
                  </td>
                  <td className="name-cell">{k.nama_karyawan}</td>
                  <td>{k.nama_divisi || k.id_divisi}</td>
                  <td>
                    {k.wajah ? (
                      <span className="badge badge-success">✅ Terdaftar</span>
                    ) : (
                      <span className="badge badge-warning">⚠️ Belum</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {karyawanList.length > 0 && (
        <div className="table-footer">
          <span className="table-count">
            Total: <strong>{karyawanList.length}</strong> karyawan
          </span>
        </div>
      )}
    </div>
  )
}

export default DaftarKaryawan
