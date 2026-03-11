document.addEventListener('DOMContentLoaded', (event) => {

    // 1. Ambil SEMUA elemen
    const videoElement = document.getElementById('kamera-feed');
    const checkinButton = document.getElementById('checkin-btn');
    const checkoutButton = document.getElementById('checkout-btn'); // <-- TOMBOL BARU
    const messageEl = document.getElementById('message');
    const overlay = document.getElementById('overlay');

    if (!videoElement || !checkinButton || !checkoutButton || !messageEl || !overlay) { // <-- Pastikan checkoutButton ada
        console.error("Elemen HTML penting tidak ditemukan.");
        return;
    }

    // Fungsi loadModels (TIDAK BERUBAH)
    function loadModels() {
        console.log("Memuat model untuk absensi...");
        const MODEL_URL = '/models';
        return Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
    }

    // Fungsi startRealtimeDetection (TIDAK BERUBAH)
    function startRealtimeDetection() {
        console.log("Memulai deteksi real-time (garis biru)...");

        setInterval(async () => {
            if (videoElement.paused || videoElement.ended) return;

            const displaySize = {
                width: videoElement.clientWidth,
                height: videoElement.clientHeight
            };
            if (displaySize.width === 0 || displaySize.height === 0) return;

            faceapi.matchDimensions(overlay, displaySize);

            const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks();

            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            const context = overlay.getContext('2d');
            context.clearRect(0, 0, overlay.width, overlay.height);
            faceapi.draw.drawDetections(overlay, resizedDetections);

        }, 100);
    }

    // Fungsi startCamera (TIDAK BERUBAH)
    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            videoElement.srcObject = stream;

            videoElement.onplay = () => {
                console.log("Kamera siap untuk absensi.");
                startRealtimeDetection();
            };
        } catch (err) {
            console.error("Error mengakses kamera: ", err);
            alert("Tidak bisa mengakses kamera.");
        }
    }

    // --- FUNGSI UTAMA ---
    // Kita buat 1 fungsi yang bisa menangani 'checkin' dan 'checkout'
    async function handleAttendance(type) {
        const url = `/absensi/${type}`;
        const actionText = (type === 'checkin') ? "Check-in" : "Check-out";

        messageEl.innerText = `Memproses ${actionText}... Tahan wajah Anda...`;
        messageEl.style.color = '#333';
        checkinButton.disabled = true;
        checkoutButton.disabled = true;

        try {
            // 1. Deteksi wajah
            const detection = await faceapi.detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                throw new Error("Wajah tidak terdeteksi. Coba lagi.");
            }

            // 2. Kirim ke backend
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descriptor: detection.descriptor }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || `Server error: ${response.status}`);
            }

            // 4. Tampilkan hasil
            if (result.success) {
                // Ambil waktu SEKARANG (untuk aksi saat ini)
                const now = new Date();
                const currentTimeString = now.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                let successMessage = '';

                if (type === 'checkin') {
                    // --- LOGIKA CHECK-IN ---
                    successMessage = `Selamat datang, ${result.nama}!\nCheck-in pada pukul ${currentTimeString}`;
                } else {
                    // --- LOGIKA CHECK-OUT ---
                    // Pastikan backend mengirim 'waktu_checkin' di dalam 'result'
                    // Contoh result dari backend: { success: true, nama: 'Budi', waktu_checkin: '08:00' }

                    const jamCheckin = result.waktu_checkin || "-"; // Fallback jika data kosong

                    successMessage = `Selamat tinggal, ${result.nama}!\nCheck-in: ${jamCheckin}\nCheck-out: ${currentTimeString}`;
                }

                messageEl.innerText = successMessage;
                messageEl.style.color = 'green';
            } else {
                throw new Error(result.message || `Wajah tidak dikenali. (Jarak: ${result.distance.toFixed(2)})`);
            }

        } catch (err) {
            console.error(`Error saat ${actionText}:`, err);
            messageEl.innerText = err.message;
            messageEl.style.color = 'red';
        }

        // Reset Otomatis
        setTimeout(() => {
            messageEl.innerText = "Sistem siap. Silakan absen.";
            messageEl.style.color = '#333';
            checkinButton.disabled = false;
            checkoutButton.disabled = false;
        }, 4000);
    }


    // --- PROSES INISIALISASI ---
    console.log("Halaman absensi dimuat.");
    messageEl.innerText = "Tunggu, sedang memuat model AI...";

    loadModels().then(() => {
        startCamera();
        console.log("Model siap.");
        messageEl.innerText = "Sistem siap. Silakan absen.";

        // Aktifkan kedua tombol
        checkinButton.disabled = false;
        checkoutButton.disabled = false;

        // Tambahkan listener ke KEDUA tombol
        checkinButton.addEventListener('click', () => handleAttendance('checkin'));
        checkoutButton.addEventListener('click', () => handleAttendance('checkout')); // <-- BARU

    }).catch(err => {
        console.error("Gagal inisialisasi:", err);
        messageEl.innerText = "Gagal memuat sistem. Coba refresh.";
    });
});