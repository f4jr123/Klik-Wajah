import React, { useRef, useEffect, useState } from 'react';
import { Camera, Loader2, UserPlus, CheckCircle2, RefreshCw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import apiService from '../services/api';

const TambahKaryawan = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [listDivisi, setListDivisi] = useState([]);
  const [formData, setFormData] = useState({
    id_karyawan: '',
    nik: '',
    nama_karyawan: '',
    id_divisi: ''
  });

  useEffect(() => {
    getVideo();
    loadDivisi();
  }, []);

  const loadDivisi = async () => {
    try {
      const res = await apiService.getDivisi();
      if (res.data.status) {
        setListDivisi(res.data.divisi);
      }
    } catch (err) {
      console.error("Gagal memuat divisi:", err);
    }
  };

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => console.error("Webcam error: ", err));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCekrek = () => {
    if (capturedPhotos.length >= 5) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      setCapturedPhotos([...capturedPhotos, blob]);
    }, 'image/jpeg');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (capturedPhotos.length < 5) return alert("Ambil 5 foto wajah dulu!");
    setLoading(true);

    try {
      // --- LANGKAH 1: KIRIM 5 FOTO KE PYTHON ---
      const facePayload = new FormData();
      capturedPhotos.forEach((blob, index) => {
        facePayload.append(`foto${index + 1}`, blob, `face_${index + 1}.jpg`);
      });

      const pythonRes = await apiService.processEmbeddings(facePayload);

      if (pythonRes.data.status) {
        // --- LANGKAH 2: KIRIM DATA KE EXPRESS ---
        const finalFormData = new FormData();
        finalFormData.append('id_karyawan', formData.id_karyawan);
        finalFormData.append('nik', formData.nik);
        finalFormData.append('nama_karyawan', formData.nama_karyawan);
        finalFormData.append('id_divisi', formData.id_divisi);
        finalFormData.append('faceDescriptor', JSON.stringify(pythonRes.data.face_embedding));
        
        // Foto pertama (index 0) dikirim sebagai file profil fisik
        finalFormData.append('foto', capturedPhotos[0], `profile_${formData.nik}.jpg`);

        const finalRes = await apiService.saveKaryawan(finalFormData);

        if (finalRes.data.status) {
          alert("Pendaftaran Berhasil! Data dan Foto Profil tersimpan.");
          setFormData({ id_karyawan: '', nik: '', nama_karyawan: '', id_divisi: '' });
          setCapturedPhotos([]);
        }
      }
    } catch (err) {
      console.error("Detail Error:", err.response?.data || err.message);
      alert("Gagal menyimpan data. Pastikan folder uploads sudah ada.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#f8faff', minHeight: '100vh' }}>
      <Sidebar activePage="Karyawan" />

      <main className="flex-grow-1">
        <header className="p-4 d-flex justify-content-between align-items-start"
          style={{ backgroundColor: '#6c63ff', height: '180px', color: 'white' }}>
          <h6 className="fw-bold m-0" style={{ letterSpacing: '1px' }}>SMART ATTENDANCE</h6>
          <div className="d-flex align-items-center gap-2">
            <img src={`https://ui-avatars.com/api/?name=${formData.nama_karyawan || 'User'}&background=random`}
              alt="User" className="rounded-circle border border-2 border-white" width="35" />
            <span className="small">yona</span>
          </div>
        </header>

        <div className="container-fluid px-4" style={{ marginTop: '-80px' }}>
          <div className="row g-4">
            {/* Form Input */}
            <div className="col-xl-7">
              <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4">
                <h5 className="fw-bold mb-4">Registrasi Data Diri</h5>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">ID KARYAWAN</label>
                      <input name="id_karyawan" value={formData.id_karyawan} type="text"
                        className="form-control py-3 border-0 bg-light" placeholder="K001"
                        onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">NIK</label>
                      <input name="nik" value={formData.nik} type="text"
                        className="form-control py-3 border-0 bg-light" placeholder="16 Digit NIK"
                        onChange={handleInputChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">NAMA LENGKAP</label>
                      <input name="nama_karyawan" value={formData.nama_karyawan} type="text"
                        className="form-control py-3 border-0 bg-light" onChange={handleInputChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">DIVISI</label>
                      <select name="id_divisi" value={formData.id_divisi}
                        className="form-select py-3 border-0 bg-light" onChange={handleInputChange} required>
                        <option value="">Pilih Divisi</option>
                        {listDivisi.map((div) => (
                          <option key={div.id_divisi} value={div.id_divisi}>{div.nama_divisi}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 mt-5">
                      <button type="submit" disabled={loading || capturedPhotos.length < 5}
                        className="btn w-100 py-3 text-white fw-bold rounded-3 shadow"
                        style={{ backgroundColor: capturedPhotos.length < 5 ? '#a5a6f6' : '#4f46e5', border: 'none' }}>
                        {loading ? <Loader2 className="animate-spin d-inline me-2" size={20} /> : <UserPlus className="d-inline me-2" size={20} />}
                        Simpan Data Karyawan
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Kamera Section */}
            <div className="col-xl-5">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
                <h6 className="fw-bold text-muted mb-3">CAPTURE WAJAH ({capturedPhotos.length}/5)</h6>
                
                <div className="position-relative rounded-4 overflow-hidden shadow-lg mx-auto"
                  style={{ width: '100%', maxWidth: '350px', aspectRatio: '3/4', backgroundColor: '#000' }}>
                  
                  <video ref={videoRef} className="w-100 h-100"
                    style={{ objectFit: 'cover', transform: 'scaleX(-1)' }} muted></video>

                  {/* --- KOTAK DETEKSI BIRU (FACE OVERLAY) --- */}
                  <div className="position-absolute top-50 start-50 translate-middle"
                    style={{
                      width: '65%',
                      height: '55%',
                      border: '2px solid #3b82f6',
                      borderRadius: '30px',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)',
                      pointerEvents: 'none'
                    }}>
                    <div className="position-absolute top-0 start-50 translate-middle-x mt-n3">
                         <span className="badge bg-primary text-white" style={{fontSize: '9px'}}>SCAN WAJAH</span>
                    </div>
                  </div>
                  
                  <canvas ref={canvasRef} className="d-none"></canvas>
                  
                  <button type="button" onClick={handleCekrek} disabled={capturedPhotos.length >= 5 || loading}
                    className="btn btn-white rounded-circle position-absolute bottom-0 start-50 translate-middle-x mb-4 shadow-lg d-flex align-items-center justify-content-center"
                    style={{ width: '65px', height: '65px', backgroundColor: '#fff', border: 'none', zIndex: 10 }}>
                    <Camera size={28} color="#4f46e5" />
                  </button>
                </div>

                <div className="d-flex gap-2 mt-4 justify-content-center">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`rounded-3 d-flex align-items-center justify-content-center ${capturedPhotos[i] ? 'bg-success' : 'bg-light border'}`}
                      style={{ width: '45px', height: '45px' }}>
                      {capturedPhotos[i] ? <CheckCircle2 size={18} color="white" /> : <span className="small text-muted">{i + 1}</span>}
                    </div>
                  ))}
                </div>

                {capturedPhotos.length > 0 && (
                  <button onClick={() => setCapturedPhotos([])} className="btn btn-link text-danger mt-3 text-decoration-none small">
                    <RefreshCw size={14} className="me-1" /> Reset Foto
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TambahKaryawan;