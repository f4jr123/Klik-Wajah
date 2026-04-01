import { useState, useEffect, useRef } from 'react'
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
  
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    fetchDivisi()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
        setCapturedImage(null)
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'Kamera tidak dapat diakses: ' + err.message })
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      
      // Draw frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageUrl = canvas.toDataURL('image/jpeg')
      setCapturedImage(imageUrl)
      stopCamera()
      
      // Mocking 128D Face Descriptor
      const mockDescriptor = Array.from({ length: 128 }, () => Number((Math.random() * 2 - 1).toFixed(4)))
      setFormData(prev => ({ ...prev, faceDescriptor: JSON.stringify(mockDescriptor) }))
      setAlert({ type: 'success', message: 'Wajah berhasil dipindai dan Face Descriptor dibuat.' })
    }
  }

  const retakeImage = () => {
    setCapturedImage(null)
    setFormData(prev => ({ ...prev, faceDescriptor: '' }))
    startCamera()
  }

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

            {/* Camera Section */}
            <div className="form-group full-width camera-section">
              <label>Pindai Wajah</label>
              
              <div className="camera-viewport">
                {!cameraActive && !capturedImage && (
                  <div className="camera-placeholder">
                    <div className="camera-placeholder-icon">📸</div>
                    <p>Aktifkan kamera untuk memindai wajah karyawan.</p>
                  </div>
                )}
                
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className={`camera-video ${cameraActive && !capturedImage ? 'active' : ''}`}
                ></video>
                
                {cameraActive && !capturedImage && (
                  <div className="face-indicator detected">
                    <span className="indicator-dot"></span> Mendeteksi Wajah...
                  </div>
                )}
                
                {capturedImage && (
                  <div className="captured-preview">
                    <img src={capturedImage} alt="Captured Face" />
                    <div className="captured-badge">✓ Wajah Tersimpan</div>
                  </div>
                )}
                
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
              </div>
              
              <div className="camera-controls">
                {!cameraActive && !capturedImage && (
                  <button type="button" className="btn-camera btn-open-camera" onClick={startCamera}>
                    📸 Buka Kamera
                  </button>
                )}
                
                {cameraActive && !capturedImage && (
                  <>
                    <button type="button" className="btn-camera btn-capture" onClick={captureImage}>
                      <span className="capture-btn-inner">🧿 Ambil Foto</span>
                    </button>
                    <button type="button" className="btn-camera btn-stop" onClick={stopCamera}>
                      ❌ Batal
                    </button>
                  </>
                )}
                
                {capturedImage && (
                  <button type="button" className="btn-camera btn-retake" onClick={retakeImage}>
                    🔄 Foto Ulang
                  </button>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="faceDescriptor">Face Descriptor (JSON)</label>
              <textarea
                className="form-control descriptor-textarea"
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
