import React, { useRef, useEffect, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import axios from 'axios';

const TambahKaryawan = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Ref untuk capture gambar
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id_karyawan: '',
    nama_karyawan: '',
    divisi: ''
  });

  // URL Config - Ganti NGROK_URL dengan hasil dari terminal Python kamu
  const NGROK_URL = "https://jerrell-impetrative-cullen.ngrok-free.dev/"; 
  const EXPRESS_API = "http://localhost:3000/api/karyawan";

  useEffect(() => {
    getVideo();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Capture Frame dari Video
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    // 2. Ubah ke Blob Image
    canvas.toBlob(async (blob) => {
      const facePayload = new FormData();
      facePayload.append('file', blob, 'face.jpg');
      facePayload.append('id_karyawan', formData.id_karyawan);

      try {
        // 3. Kirim ke FastAPI (Python) via Ngrok
        const pythonRes = await axios.post(`${NGROK_URL}/process-face`, facePayload);

        if (pythonRes.data.success) {
          // 4. Jika wajah terdeteksi, kirim semua data ke Express
          const finalPayload = {
            ...formData,
            face_embedding: pythonRes.data.embedding // Vektor wajah dari Python
          };

          await axios.post(EXPRESS_API, finalPayload);
          alert("Karyawan berhasil didaftarkan dengan data wajah!");
        } else {
          alert("Gagal: " + pythonRes.data.message);
        }
      } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan koneksi ke server AI (Python).");
      } finally {
        setLoading(false);
      }
    }, 'image/jpeg');
  };

  return (
    <div className="container-fluid p-0" style={{ backgroundColor: '#f8faff', minHeight: '100vh' }}>
      <header className="p-4 d-flex justify-content-between align-items-start" 
        style={{ backgroundColor: '#8a70ff', height: '160px', color: 'white' }}>
        <span className="fw-semibold tracking-wide">SMART ATTANDANCE</span>
        <div className="d-flex align-items-center gap-2">
          <img src="https://ui-avatars.com/api/?name=Yona&background=random" alt="User" className="rounded-circle border border-2 border-white" width="35" />
          <span className="small">yona</span>
        </div>
      </header>

      <div className="container" style={{ marginTop: '-80px' }}>
        <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 mb-5">
          <h4 className="fw-bold mb-5" style={{ color: '#4a5568' }}>Form Tambah Karyawan</h4>
          
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-12">
                <label className="form-label small fw-bold text-secondary">ID Karyawan</label>
                <input name="id_karyawan" type="text" className="form-control form-control-lg bg-light border-0 py-3" placeholder="Contoh: 2024001" onChange={handleInputChange} required />
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold text-secondary">Nama Karyawan</label>
                <input name="nama_karyawan" type="text" className="form-control form-control-lg bg-light border-0 py-3" onChange={handleInputChange} required />
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold text-secondary">Divisi</label>
                <select name="divisi" className="form-select form-select-lg bg-light border-0 py-3" onChange={handleInputChange} required defaultValue="">
                  <option value="" disabled>Select Option</option>
                  <option value="IT">IT Department</option>
                  <option value="HR">HRD</option>
                  <option value="FINANCE">Finance</option>
                </select>
              </div>

              <div className="col-12 mt-4">
                <label className="form-label small fw-bold text-secondary mb-3">Wajah Karyawan</label>
                <div className="rounded-3 overflow-hidden bg-dark position-relative shadow-sm" style={{ maxWidth: '500px', aspectRatio: '4/3' }}>
                  <video ref={videoRef} className="w-100 h-100" style={{ objectFit: 'cover' }} muted></video>
                  <canvas ref={canvasRef} className="d-none"></canvas>
                  
                  {!loading && (
                    <div className="position-absolute top-50 start-50 translate-middle text-white opacity-25">
                      <Camera size={48} />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12 d-flex justify-content-end mt-5">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn px-4 py-2 text-white fw-semibold rounded-3 shadow-sm d-flex align-items-center gap-2"
                  style={{ backgroundColor: '#6366f1', border: 'none' }}
                >
                  {loading && <Loader2 className="animate-spin" size={18} />}
                  {loading ? 'Memproses Wajah...' : 'Simpan Data Karyawan'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TambahKaryawan;