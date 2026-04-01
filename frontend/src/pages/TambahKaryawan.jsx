import { useState, useEffect } from 'react'
import { getKaryawanPrepareAdd, tambahKaryawan } from '../services/api.js'
import './TambahKaryawan.css'

function TambahKaryawan() {
  const [formData, setFormData] = useState({
    id_karyawan: '',
    nama_karyawan: '',
    id_divisi: '',
    faceDescriptor: ''
  })

  const [divisiList, setDivisiList] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    fetchDivisi()
  }, [])

  const fetchDivisi = async () => {
    try {
      const res = await getKaryawanPrepareAdd()
      if (res.data.status) {
        setDivisiList(res.data.divisi)
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'Gagal memuat data divisi. Pastikan backend berjalan.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setAlert(null)

    try {
      const payload = {
        ...formData,
        faceDescriptor: formData.faceDescriptor
          ? JSON.parse(formData.faceDescriptor)
          : []
      }
      const res = await tambahKaryawan(payload)
      if (res.data.status) {
        setAlert({ type: 'success', message: res.data.message })
        setFormData({ id_karyawan: '', nama_karyawan: '', id_divisi: '', faceDescriptor: '' })
      } else {
        setAlert({ type: 'danger', message: res.data.message })
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.'
      setAlert({ type: 'danger', message: msg })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div className="tambah-karyawan">
      <div className="page-header">
        <h1>Tambah Karyawan</h1>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`} id="form-alert">
          {alert.type === 'success' ? '✅' : '❌'} {alert.message}
        </div>
      )}

      <div className="card form-card">
        <form onSubmit={handleSubmit} id="form-tambah-karyawan">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="id_karyawan">ID Karyawan</label>
              <input
                type="text"
                className="form-control"
                id="id_karyawan"
                name="id_karyawan"
                placeholder="Masukkan ID karyawan"
                value={formData.id_karyawan}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nama_karyawan">Nama Karyawan</label>
              <input
                type="text"
                className="form-control"
                id="nama_karyawan"
                name="nama_karyawan"
                placeholder="Masukkan nama lengkap"
                value={formData.nama_karyawan}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="id_divisi">Divisi</label>
              <select
                className="form-control"
                id="id_divisi"
                name="id_divisi"
                value={formData.id_divisi}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Divisi --</option>
                {divisiList.map((d) => (
                  <option key={d.id_divisi} value={d.id_divisi}>
                    {d.nama_divisi}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="faceDescriptor">Face Descriptor (JSON)</label>
              <textarea
                className="form-control"
                id="faceDescriptor"
                name="faceDescriptor"
                placeholder='Data face descriptor dalam format JSON array, contoh: [0.123, -0.456, ...]'
                rows="4"
                value={formData.faceDescriptor}
                onChange={handleChange}
              />
              <small className="form-hint">
                💡 Data ini biasanya diisi otomatis dari kamera face recognition.
              </small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              id="btn-submit-karyawan"
            >
              {submitting ? (
                <>
                  <span className="btn-spinner"></span> Menyimpan...
                </>
              ) : (
                <>💾 Simpan Karyawan</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TambahKaryawan
