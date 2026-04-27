import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './TambahKaryawan.css';

function TambahKaryawan() {
  const [formData, setFormData] = useState({
    id_karyawan: '', nik: '', nama_karyawan: '', id_divisi: '', face_embedding: '', status: 'aktif'
  });
  const [divisiList, setDivisiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Fetch Divisi
    const fetchDivisi = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/divisi');
        setDivisiList(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchDivisi();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) { setAlert({ type: 'danger', message: 'Kamera error' }); }
  };

  return (
    <div className="layout-wrapper">
      {/* SIDEBAR Tampilan Saja */}
      <aside className="sidebar">
        <div className="sidebar-brand"><h2>KlikWajah</h2></div>
        <nav className="menu-list">
          <div className="menu-item">Dashboard</div>
          <div className="menu-item active">Karyawan</div>
          <div className="menu-item">Absensi</div>
          <div className="menu-item">Laporan</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="blue-header">
          <div className="header-top">
            <span className="smart-text">SMART ATTANDANCE</span>
            <div className="user-profile">
              <span></span>
              <div className="avatar-circle">Y</div>
            </div>
          </div>
        </header>

        <div className="content-body">
          <div className="form-card">
            <h3>Form Tambah Karyawan</h3>
            <form className="form-grid">
              <div className="input-box">
                <label>ID Karyawan</label>
                <input type="text" placeholder="Input ID" />
              </div>
              <div className="input-box">
                <label>NIK</label>
                <input type="text" placeholder="Input NIK" />
              </div>
              <div className="input-box full-width">
                <label>Nama Karyawan</label>
                <input type="text" placeholder="Input Nama" />
              </div>
              
              <div className="camera-box full-width">
                <div className="video-viewport">
                  <video ref={videoRef} autoPlay playsInline />
                  {!cameraActive && <div className="cam-placeholder">Kamera Nonaktif</div>}
                </div>
                <button type="button" className="btn-save" onClick={startCamera}>Buka Kamera</button>
              </div>
              
              <button type="submit" className="btn-save full-width">SIMPAN DATA KARYAWAN</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TambahKaryawan;