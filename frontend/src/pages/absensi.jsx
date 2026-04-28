import React, { useRef, useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { FaceDetection } from '@mediapipe/face_detection';
import * as cam from '@mediapipe/camera_utils';
import axios from 'axios';
import apiService from '../services/api'; // Menggunakan apiService kamu
import './absensi.css';

const Absensi = () => {
  const videoRef = useRef(null);
  const faceDetectionRef = useRef(null); // Tambahkan ini untuk simpan instance
  const cameraRef = useRef(null); // Tambahkan ini untuk simpan kamera

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

    // 1. Setup Face Detection Sekali Saja
    if (!faceDetectionRef.current) {
      const faceDetection = new FaceDetection({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      });

      faceDetection.setOptions({
        model: 'short',
        minDetectionConfidence: 0.7,
      });

      faceDetection.onResults(onResults);
      faceDetectionRef.current = faceDetection;
    }

    // 2. Setup Camera
    if (videoRef.current && !cameraRef.current) {
      cameraRef.current = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          if (faceDetectionRef.current) {
            await faceDetectionRef.current.send({ image: videoRef.current });
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
    };
  }, []);

  const onResults = (results) => {
    const now = Date.now();
    const COOLDOWN = 10000; // 10 Detik jeda antar absen

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

    // 3. BUAT CANVAS (Ini yang tadi bikin error karena belum didefinisikan)
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    // 4. Ubah ke Blob dan Kirim
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "verify.jpg");

      const dbEmbeddings = localStorage.getItem("karyawan_embeddings") || "[]";
      formData.append("db_embeddings", dbEmbeddings);

      try {
        const response = await apiService.verifyFaceAI(formData);
        console.log("Data mentah dari AI:", response.data);

        if (response.data.status) {
          const { id_karyawan, nama } = response.data;

          // --- TAMBAHKAN PENGECEKAN INI ---
          if (!id_karyawan) {
            console.error("AI mendeteksi wajah tapi GAGAL memberikan ID Karyawan");
            setStatus("Error: ID Karyawan kosong dari AI.");
            return; // Berhenti di sini, jangan nembak ke Express!
          }

          setStatus(`Halo ${nama}! Mencatat absen...`);

          // Pastikan ID benar-benar terkirim
          const resAbsen = await apiService.submitAbsensi({
            id_karyawan: id_karyawan,
            nama_karyawan: nama,
            tipe_absen: "masuk",
            pola_tangan: "jempol"
          });

          if (resAbsen.data.success) {
            setStatus(`Absen Berhasil: ${nama}`);
            alert(`Berhasil Absen: ${nama}`);
            lastDetectionTime.current = Date.now();
          }
        } else {
          setStatus("Wajah tidak dikenali.");
          lastDetectionTime.current = Date.now() - 7000;
        }
      } catch (error) {
        // Lihat di console browser (F12) error apa yang muncul
        console.error("Gagal simpan:", error.response?.data || error.message);
        setStatus("Gagal simpan ke database.");
      } finally {
        // Buka kunci
        isProcessing.current = false;
        setIsVerifying(false);
      }
    }, "image/jpeg");
  };

  // --- DESAIN HTML TETAP SAMA (TIDAK BERUBAH) ---
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

            <div className="video-frame">
              <video ref={videoRef} className="webcam-video" muted />
              {isVerifying && <div className="overlay-scanning">Memverifikasi...</div>}
            </div>

            <p className={`status-text ${isVerifying ? 'text-warning' : 'text-success'}`}>
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