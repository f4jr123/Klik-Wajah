document.addEventListener('DOMContentLoaded', (event) => {

    const videoElement = document.getElementById('kamera-feed');
    const captureForm = document.getElementById('capture-form');

    // Cek elemen
    if (!videoElement || !captureForm) {
        console.error("Elemen HTML penting (video atau form) tidak ditemukan!");
        return;
    }

    // --- FUNGSI-FUNGSI UTAMA ---

    // Fungsi untuk menyalakan kamera
    async function startCamera() {
        console.log("Mencoba menyalakan kamera...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            videoElement.srcObject = stream;
            return new Promise((resolve) => {
                videoElement.onloadedmetadata = () => {
                    videoElement.play();
                    console.log("Kamera menyala dan siap.");
                    resolve();
                };
            });
        } catch (err) {
            console.error("Error mengakses kamera: ", err);
            alert("Tidak bisa mengakses kamera. Pastikan Anda memberikan izin.");
            return Promise.reject(err);
        }
    }

    // Fungsi untuk memuat model-model
    function loadModels() {
        console.log("Mulai memuat model...");
        return Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models') 
        ]);
    }

    // Ini berfungsi karena 'view' Solusi 2 punya div pembungkus
    function startRealtimeDetection() {
        console.log("Memulai deteksi visual real-time...");

        const canvas = faceapi.createCanvasFromMedia(videoElement);
        
        // Ini menempatkan canvas tepat di dalam div pembungkus video
        videoElement.parentElement.append(canvas); 

        const displaySize = { width: videoElement.width, height: videoElement.height };
        faceapi.matchDimensions(canvas, displaySize);

        // Atur CSS agar canvas menimpa video dengan sempurna
        canvas.style.position = 'absolute';
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        canvas.style.pointerEvents = 'none'; // Biar canvas tidak menghalangi klik

        setInterval(async () => {
            if (videoElement.paused || videoElement.ended) return;

            const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
                                        .withFaceLandmarks(); 

            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
        }, 100);
    }

    // FUNGSI REGISTRASI TAPI DENGAN "ID INPUT BARU YANG SUDAH ADA"
    async function handleCaptureSubmit(e) {
        e.preventDefault(); 
        
        // ID input dari view 
        const idInput = document.getElementById('example-text-input');
        const nameInput = document.getElementById('example-text-nama');
        const divisiInput = document.getElementById('example-text-divisi');
        const descriptorInput = document.getElementById('face-descriptor');

        // Validasi
        if (!idInput.value || !nameInput.value || !divisiInput.value) {
            alert("Harap isi semua data karyawan (ID, Nama, dan Divisi)!");
            return;
        }

        console.log("Form submit dicegat. Memulai pengambilan wajah...");
        
        // **KEMBALI MENCARI <button>**
        // Karena 'view' Solusi 2 menggunakan <button>
        const submitButton = captureForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        // **KEMBALI MENGGUNAKAN .textContent**
        submitButton.textContent = "MEMPROSES... LIHAT KAMERA"; 

        try {
            // Deteksi BERAT (satu kali)
            const detection = await faceapi.detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
                                        .withFaceLandmarks()
                                        .withFaceDescriptor(); 

            if (detection) {
                // BERHASIL
                const descriptor = detection.descriptor;
                descriptorInput.value = JSON.stringify(Array.from(descriptor));
                
                alert(`Wajah untuk ${nameInput.value} berhasil ditangkap! Mengirim data...`);
                captureForm.submit(); // Kirim form

            } else {
                // GAGAL
                alert("Wajah tidak terdeteksi. Pastikan wajah terlihat jelas di kamera dan coba lagi.");
                submitButton.disabled = false;
                submitButton.textContent = "Simpan Data Karyawan"; // Teks tombol asli
            }
        } catch (err) {
            console.error("Error saat mengambil descriptor:", err);
            alert("Terjadi error saat pemrosesan. Coba lagi.");
            submitButton.disabled = false;
            submitButton.textContent = "Simpan Data Karyawan";
        }
    }


    // --- PROSES INISIALISASI ---
    console.log("Menunggu HTML dimuat... OK.");
    console.log("Memulai inisialisasi (memuat model DAN menyalakan kamera)...");

    Promise.all([
        loadModels(),
        startCamera()
    ]).then(() => {
        console.log("Model dan Kamera siap.");
        startRealtimeDetection();
        
        captureForm.addEventListener('submit', handleCaptureSubmit);
        console.log("Aplikasi siap. Listener form sudah terpasang.");

    }).catch(err => {
        console.error("Gagal inisialisasi:", err);
    });

});