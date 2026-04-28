import React, { useRef, useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import './absensi.css'; // Pastikan membuat file CSS pendamping

const Absensi = () => {
  const videoRef = useRef(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Format Tanggal: Selasa, 28 April 2026
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const today = new Date().toLocaleDateString('id-ID', options);
    setCurrentDate(today);

    // Aktifkan Kamera Otomatis
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Gagal akses kamera:", err);
      }
    };

    startVideo();
  }, []);

  return (
    <div className="absensi-container">
      {/* Top Navbar */}
      <nav className="navbar-transparent">
        <span className="brand-logo">KBINSURANCE</span>
        <button className="btn-settings">
          <Settings size={18} color="white" />
        </button>
      </nav>

      {/* Hero Section (Purple Area) */}
      <div className="hero-purple">
        <div className="text-center text-white">
          <h1 className="display-4 fw-bold mb-3"></h1>
          <p className="mb-1">Selamat datang</p>
        </div>
      </div>

      {/* Card Absensi (Floating Area) */}
      <div className="content-wrapper">
        <div className="absensi-card">
          <div className="card-header-info">
            <h5 className="text-muted fw-bold">Silahkan Absen</h5>
            <p className="small text-secondary mb-0">Jam Masuk 08:00 | Jam Pulang 17:00</p>
          </div>

          <div className="card-body-webcam">
            {/* Tanggal Absen */}
            <p className="text-center text-black mb-3 opacity-75">Tanggal Absen: {currentDate}</p>
            
            {/* Webcam View */}
            <div className="video-frame">
              <video ref={videoRef} muted />
            </div>
            
            <p className="status-text">Sistem siap. Silakan absen.</p>

            <div className="button-group">
              <button className="btn-absen">Checkin</button>
              <button className="btn-absen">Checkout</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-absensi">
        <p>© 2022 <span className="text-primary cursor-pointer">Creative Tim</span></p>
      </footer>
    </div>
  );
};

export default Absensi;