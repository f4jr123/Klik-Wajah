const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Karyawan = require('../model/Karyawan');
const Divisi = require('../model/Divisi');

/**
 * --- KONFIGURASI MULTER ---
 * Digunakan untuk menangani upload foto fisik karyawan.
 * Foto disimpan di folder: public/uploads/karyawan/
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/karyawan/');
    },
    filename: (req, file, cb) => {
        // Format: NIK-Timestamp.ekstensi
        const nik = req.body.nik || 'temp';
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${nik}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Batasi ukuran file maksimal 2MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) return cb(null, true);
        cb(new Error("Hanya file gambar (jpg/png) yang diperbolehkan!"));
    }
});

/**
 * GET /api/karyawan
 * Menampilkan semua daftar karyawan untuk tabel di Dashboard HRD.
 */
router.get('/', async function (req, res) {
    try {
        let rows = await Karyawan.getAllWithDivisi();
        return res.status(200).json({
            status: true,
            data: rows
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Gagal mengambil data karyawan' });
    }
});

/**
 * GET /api/karyawan/prepare-add
 * Mengambil data divisi untuk pilihan dropdown di form tambah karyawan.
 */
router.get('/prepare-add', async function (req, res) {
    try {
        let divisiRows = await Divisi.getAll();
        return res.status(200).json({
            status: true,
            divisi: divisiRows
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: 'Gagal memuat data pendukung' });
    }
});

/**
 * GET /api/karyawan/embeddings
 * Endpoint KRUSIAL untuk Anti-Lag. Mengirim data wajah ke browser saat aplikasi dibuka.
 */
router.get('/embeddings', async function (req, res) {
    try {
        let rows = await Karyawan.getEmbeddings();

        // Parsing string JSON dari DB kembali menjadi Array agar bisa diolah AI di React
        const formattedData = rows.map(row => ({
            id: row.id,
            id_karyawan: row.id_karyawan,
            nama_karyawan: row.nama_karyawan,
            face_embedding: row.face_embedding ? JSON.parse(row.face_embedding) : []
        }));

        return res.status(200).json({
            status: true,
            data: formattedData
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Gagal sinkronisasi data wajah' });
    }
});

/**
 * POST /api/karyawan/tambah
 * Endpoint untuk pendaftaran karyawan baru atau update biometrik wajah.
 */
router.post('/tambah', upload.single('foto'), async (req, res) => {
    try {
        // faceDescriptor adalah array 128 angka dari Python/AI
        let { id, id_karyawan, nik, nama_karyawan, id_divisi, faceDescriptor } = req.body;
        const fotoPath = req.file ? req.file.filename : null;

        // Validasi minimal: Wajah wajib ada
        if (!faceDescriptor) {
            return res.status(400).json({
                status: false,
                message: 'Data wajah kosong. Silakan scan wajah terlebih dahulu.'
            });
        }

        if (id) {
            // MODE: Registrasi Ulang Wajah (Update)
            let updateData = {
                face_embedding: faceDescriptor // Tetap simpan sebagai string JSON
            };
            if (fotoPath) updateData.foto = fotoPath;

            await Karyawan.UpdateFace(id, updateData);
            return res.status(200).json({
                status: true,
                message: 'Data wajah karyawan berhasil diperbarui!'
            });

        } else {
            // MODE: Tambah Karyawan Baru
            if (!nik || !nama_karyawan) {
                return res.status(400).json({ status: false, message: 'NIK dan Nama wajib diisi' });
            }

            let Data = {
                id_karyawan,
                nik,
                nama_karyawan,
                id_divisi,
                foto: fotoPath,
                face_embedding: faceDescriptor, // Array dari Python disimpan sebagai string JSON
                status: 'aktif'
            };

            await Karyawan.Store(Data);
            return res.status(201).json({
                status: true,
                message: 'Karyawan baru berhasil didaftarkan!'
            });
        }

    } catch (err) {
        console.error("Registrasi Error:", err);
        return res.status(500).json({
            status: false,
            message: 'Terjadi kesalahan server saat menyimpan data.'
        });
    }
});

module.exports = router;