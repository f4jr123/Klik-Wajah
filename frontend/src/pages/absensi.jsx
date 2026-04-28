import React, { useRef, useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { FaceDetection } from '@mediapipe/face_detection';
import * as cam from '@mediapipe/camera_utils';
import axios from 'axios';
import './absensi.css';

const Absensi = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentDate, setCurrentDate] = useState("");
  const [status, setStatus] = useState("Menunggu deteksi wajah...");
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastVerifyTime, setLastVerifyTime] = useState(0);

  // GANTI DENGAN URL NGROK KAMU DARI TERMINAL FASTAPI
  const AI_SERVER_URL = "https://your-ngrok-url.ngrok-free.app";

  useEffect(() => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('id-ID', options));

    // --- 1. Setup MediaPipe Face Detection ---
    const faceDetection = new FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: 'short',
      minDetectionConfidence: 0.7,
    });

    faceDetection.onResults(onResults);

    // --- 2. Setup Camera Helper ---
    if (typeof videoRef.current !== "undefined" && videoRef.current !== null) {
      const camera = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          await faceDetection.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  // --- 3. Fungsi Logika Deteksi & Verifikasi ---
  const onResults = (results) => {
    const now = Date.now();

    // Jika wajah terdeteksi DAN sedang tidak memproses verifikasi DAN jeda 5 detik dari verifikasi terakhir
    if (results.detections.length > 0 && !isVerifying && now - lastVerifyTime > 5000) {
      console.log("Wajah terdeteksi! Mengirim frame ke AI...");
      handleVerify();
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setStatus("Verifikasi wajah... Mohon tunggu.");

    // Ambil Snapshot dari Video ke Base64
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "verify.jpg");
      
      // Ambil data DB_EMBEDDINGS dari LocalStorage/Context (Dapatkan dari MySQL React kamu)
      // Disini kita asumsikan kamu punya list embeddings dari database karyawan
      const dbEmbeddings = localStorage.getItem("karyawan_embeddings") || "[]";
      formData.append("db_embeddings", dbEmbeddings);

      try {
        const response = await axios.post(`${AI_SERVER_URL}/verify-face`, formData);
        
        if (response.data.status) {
          setStatus(`Selamat Datang, ${response.data.nama}!`);
          // Logika Absen (Checkin Otomatis atau Munculkan Tombol)
          alert(`Absen Berhasil: ${response.data.nama}`);
        } else {
          setStatus("Wajah tidak dikenali. Silakan coba lagi.");
        }
      } catch (error) {
        console.error("Error verifikasi:", error);
        setStatus("Gagal menghubungi server AI.");
      } finally {
        setIsVerifying(false);
        setLastVerifyTime(Date.now());
      }
    }, "image/jpeg");
  };

  return (
    <div className="absensi-container">
      <nav className="navbar-transparent">
        <span className="brand-logo">KBINSURANCE</span>
        <button className="btn-settings"><Settings size={18} color="white" /></button>
      </nav>

      <div className="hero-purple"></div>

      <div className="content-wrapper">
        <div className="absensi-card">
          <div className="card-header-info">
            <h5 className="text-muted fw-bold">Absensi Wajah Otomatis</h5>
            <p className="small text-secondary mb-0">Hadapkan wajah ke kamera</p>
          </div>

          <div className="card-body-webcam">
            <p className="text-center text-black mb-3 opacity-75">Hari ini: {currentDate}</p>
            
            <div className="video-frame">
              <video ref={videoRef} className="webcam-video" muted />
              {isVerifying && <div className="overlay-scanning">Memverifikasi...</div>}
            </div>
            
            <p className={`status-text ${isVerifying ? 'text-warning' : 'text-success'}`}>
              {status}
            </p>

            <div className="button-group">
              <button className="btn-absen" disabled={isVerifying}>Checkin</button>
              <button className="btn-absen" disabled={isVerifying}>Checkout</button>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer-absensi">
        <p>© 2026 <span className="text-primary">KlikWajah System</span></p>
      </footer>
    </div>
  );
};

export default Absensi;