import React, { useRef, useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { FaceDetection } from '@mediapipe/face_detection';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import * as cam from '@mediapipe/camera_utils';
import axios from 'axios';
import apiService from '../services/api';
import './absensi.css';

const Absensi = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Canvas untuk menggambar garis tangan
  const faceDetectionRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);

  const isProcessing = useRef(false);
  const lastDetectionTime = useRef(0);

  const [currentDate, setCurrentDate] = useState("");
  const [status, setStatus] = useState("Inisialisasi sistem...");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('id-ID', options));

    const fetchLatestEmbeddings = async () => {
      try {
        const res = await apiService.getEmbeddings();
        if (res.data.status) {
          console.log("Data biometrik terbaru berhasil dimuat:", res.data.data);
          localStorage.setItem("karyawan_embeddings", JSON.stringify(res.data.data));
        }
      } catch (err) {
        console.error("Gagal sinkronisasi data dari MySQL:", err);
      }
    };
    fetchLatestEmbeddings();

    // 1. Setup Face Detection (Wajah)
    if (!faceDetectionRef.current) {
      const faceDetection = new FaceDetection({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      });

      faceDetection.setOptions({
        model: 'short',
        minDetectionConfidence: 0.7,
      });

      faceDetection.onResults(onFaceResults);
      faceDetectionRef.current = faceDetection;
    }

    // 2. Setup Hands Detection (UNTUK VISUAL EFEK GARIS TANGAN)
    if (!handsRef.current) {
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      hands.onResults(onHandsResults);
      handsRef.current = hands;
    }

    // 3. Setup Camera (Mengirim frame ke Wajah & Tangan)
    if (videoRef.current && !cameraRef.current) {
      cameraRef.current = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && videoRef.current.readyState === 4) {
            if (faceDetectionRef.current) await faceDetectionRef.current.send({ image: videoRef.current });
            if (handsRef.current) await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });
      cameraRef.current.start();
    }

    // Fungsi Bersih-bersih saat pindah halaman
    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (faceDetectionRef.current) faceDetectionRef.current.close();
      if (handsRef.current) handsRef.current.close();
    };
  }, []);

  // --- FUNGSI MENGGAMBAR EFEK (GARIS TANGAN) ---
  const onHandsResults = (results) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        // Gambar Garis Penghubung (Warna Cyan / Biru Muda)
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00e5ff', lineWidth: 4 });
        // Gambar Titik Sendi (Warna Putih pinggiran Biru)
        drawLandmarks(canvasCtx, landmarks, { color: '#ffffff', lineWidth: 2, radius: 4 });
      }
    }
    canvasCtx.restore();
  };

  const onFaceResults = (results) => {
    const now = Date.now();
    const COOLDOWN = 3000; // 3 Detik jeda antar absen

    // CEK MENGGUNAKAN REF (.current)
    if (
      results.detections.length > 0 &&
      !isProcessing.current &&
      (now - lastDetectionTime.current > COOLDOWN)
    ) {
      handleVerify();
    }
  };

  const handleVerify = async () => {
    // 1. Kunci proses agar tidak spam
    isProcessing.current = true;
    setIsVerifying(true);
    setStatus("Mengenali wajah... Mohon tunggu.");

    // 2. CEK: Pastikan videoRef ada
    if (!videoRef.current) return;

    // 3. BUAT CANVAS 
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    // Video asli yang dikirim ke AI tidak terbalik, hanya CSS-nya saja yang dibalik.
    ctx.drawImage(videoRef.current, 0, 0);

    // 4. Ubah ke Blob dan Kirim
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "verify.jpg");

      const dbEmbeddings = localStorage.getItem("karyawan_embeddings") || "[]";
      formData.append("db_embeddings", dbEmbeddings);

      try {
        const response = await apiService.verifyFaceAI(formData);

        if (response.data.status) {
          const { id_karyawan, nama, tipe_absen, gesture } = response.data;

          if (!id_karyawan) {
            console.error("AI mendeteksi wajah tapi GAGAL memberikan ID Karyawan");
            setStatus("Error: ID Karyawan kosong dari AI.");
            return;
          }

          // --- 🔒 GEMBOK (Wajib pakai tangan) ---
          if (gesture === "tidak_terdeteksi") {
            setStatus("Wajah dikenali! Harap angkat tangan (Buka/Kepal) untuk absen.");
            lastDetectionTime.current = Date.now() - 7000;
            return;
          }

          // Status di layar akan menyesuaikan apakah dia masuk atau keluar
          setStatus(`Halo ${nama}! Mencatat absen ${tipe_absen}...`);

          // Mengirim data dinamis ke Backend Express
          const resAbsen = await apiService.submitAbsensi({
            id_karyawan: id_karyawan,
            nama_karyawan: nama,
            tipe_absen: tipe_absen,
            pola_tangan: gesture
          });

          if (resAbsen.data.success) {
            setStatus(`Absen ${tipe_absen} Berhasil: ${nama}`);
            alert(`Berhasil Absen ${tipe_absen}: ${nama}`);
            lastDetectionTime.current = Date.now();
          }
        } else {
          setStatus("Wajah tidak dikenali.");
          lastDetectionTime.current = Date.now() - 7000;
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        console.error("Gagal simpan:", error.response?.data || error.message);
        setStatus(`Gagal: ${errorMsg}`);
        lastDetectionTime.current = Date.now();
      } finally {
        // Buka kunci
        isProcessing.current = false;
        setIsVerifying(false);
      }
    }, "image/jpeg");
  };

  return (
    <div className="absensi-container">

      <div className="hero-purple"></div>

      <div className="content-wrapper">
        <div className="absensi-card">
          <div className="card-header-info">
            <h5 className="text-muted fw-bold">Absensi Wajah Otomatis</h5>
            <p className="small text-secondary mb-0">Hadapkan wajah ke kamera</p>
          </div>

          <div className="card-body-webcam">
            <p className="text-center text-black mb-3 opacity-75">Hari ini: {currentDate}</p>

            {/* --- STRUKTUR CSS EFEK CERMIN (MIRROR) --- */}
            <div className="video-frame" style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
              <video
                ref={videoRef}
                className="webcam-video"
                muted
                style={{
                  width: '100%',
                  display: 'block',
                  transform: 'scaleX(-1)' // <-- Membalik Video
                }}
              />

              {/* CANVAS INI YANG MENGGAMBAR GARIS TANGAN */}
              <canvas
                ref={canvasRef}
                className="overlay-canvas"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 10,
                  transform: 'scaleX(-1)' // <-- Membalik Garis Tangan biar pas sama video
                }}
              />

              {isVerifying && <div className="overlay-scanning" style={{ zIndex: 20 }}>Memverifikasi...</div>}
            </div>

            <p className={`status-text ${isVerifying ? 'text-warning' : 'text-success'}`} style={{ marginTop: '15px', fontWeight: 'bold' }}>
              {status}
            </p>

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