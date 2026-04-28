import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getKaryawanPrepareAdd, tambahKaryawan } from '../services/api.js';
import './TambahKaryawan.css';

function TambahKaryawan() {
  const [formData, setFormData] = useState({
    id_karyawan: '', nik: '', nama_karyawan: '', id_divisi: '', face_embedding: '', status: 'aktif'
  });
  const [divisiList, setDivisiList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchDivisi = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/divisi');
        setDivisiList(Array.isArray(res.data) ? res.data : []);
      } catch (err) { console.error("Gagal load divisi", err); }
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
    } catch (err) { setAlert({ type: 'danger', message: 'Kamera Error' }); }
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageUrl);
      setAlert({ type: 'success', message: 'Foto diambil! Menunggu AI...' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await tambahKaryawan({ ...formData, foto: capturedImage });
      alert('Karyawan Berhasil Disimpan!');
    } catch (err) { setAlert({ type: 'danger', message: 'Gagal Simpan!' }); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="layout-wrapper">
      <aside className="sidebar">
        <div className="sidebar-brand"><h2>KlikWajah</h2></div>
        <nav className="menu-list">
          <Link to="/" className="menu-item">Dashboard</Link>
          <Link to="/tambah-karyawan" className="menu-item active">Karyawan</Link>
          <Link to="/daftar-karyawan" className="menu-item">Daftar</Link>
          <Link to="/absensi" className="menu-item">Absensi</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="blue-header">
          <div className="header-top">
            <span className="smart-text">SMART ATTENDANCE</span>
            <div className="user-profile">yona <div className="avatar-circle">Y</div></div>
          </div>
        </header>

        <div className="content-body">
          <div className="form-card">
            <h3>Form Tambah Karyawan</h3>
            {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="input-box"><label>ID</label><input type="text" onChange={e => setFormData({...formData, id_karyawan: e.target.value})} required /></div>
              <div className="input-box"><label>NIK</label><input type="text" onChange={e => setFormData({...formData, nik: e.target.value})} required /></div>
              <div className="input-box full-width"><label>Nama</label><input type="text" onChange={e => setFormData({...formData, nama_karyawan: e.target.value})} required /></div>
              <div className="input-box full-width">
                <label>Divisi</label>
                <select onChange={e => setFormData({...formData, id_divisi: e.target.value})} required>
                  <option value="">Pilih Divisi</option>
                  {divisiList.map(d => <option key={d.id_divisi} value={d.id_divisi}>{d.nama_divisi}</option>)}
                </select>
              </div>
              <div className="camera-box full-width">
                <div className="video-viewport">
                  <video ref={videoRef} autoPlay playsInline className={!capturedImage ? 'show' : 'hide'} />
                  {capturedImage && <img src={capturedImage} />}
                  <canvas ref={canvasRef} style={{display:'none'}} />
                </div>
                <div className="btn-group">
                  {!cameraActive ? <button type="button" className="btn-save" onClick={startCamera}>Buka Kamera</button> :
                  !capturedImage ? <button type="button" className="btn-save" onClick={captureImage}>Ambil Foto</button> :
                  <button type="button" className="btn-save" onClick={() => setCapturedImage(null)}>Ulangi</button>}
                </div>
              </div>
              <button type="submit" className="btn-save-main full-width" disabled={submitting}>SIMPAN DATA</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TambahKaryawan;