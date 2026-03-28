var express = require('express');
var router = express.Router();
const Karyawan = require('../model/Karyawan');
const Divisi = require('../model/Divisi');

// Mengubah route GET untuk mengembalikan JSON
router.post('/', async function (req, res) {
    try {
        res.status(201).json({
            status: true,
            message: 'Data karyawan berhasil ditambahkan'
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// 1. Endpoint untuk mengambil data awal (User Info & List Divisi)
// Di React, ini bisa dipanggil saat halaman "Tambah Karyawan" dimuat
router.get('/prepare-add', async function (req, res) {
    try {

        let divisiRows = await Divisi.getAll();

        return res.status(200).json({
            status: true,
            divisi: divisiRows
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: 'Terjadi kesalahan server' });
    }
});

// 2. Endpoint untuk Tambah atau Update Wajah Karyawan
router.post('/tambah', async (req, res) => {
    try {
        let { id, id_karyawan, nama_karyawan, id_divisi, faceDescriptor } = req.body;

        if (!faceDescriptor || faceDescriptor.length <= 2) {
            return res.status(400).json({
                status: false,
                message: 'Data wajah tidak terdeteksi. Silakan coba lagi.'
            });
        }

        if (id) {
            // Mode Registrasi Ulang (Update)
            await Karyawan.UpdateFace(id, JSON.stringify(faceDescriptor));
            return res.status(200).json({
                status: true,
                message: 'Wajah karyawan berhasil diregistrasi ulang!'
            });
        } else {
            // Mode Tambah Karyawan Baru
            let Data = {
                id_karyawan,
                nama_karyawan,
                id_divisi,
                wajah: JSON.stringify(faceDescriptor)
            };
            await Karyawan.Store(Data);
            return res.status(201).json({
                status: true,
                message: 'Karyawan baru berhasil ditambahkan!'
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            message: 'Gagal menyimpan data. Pastikan ID Karyawan unik.'
        });
    }
});

module.exports = router;