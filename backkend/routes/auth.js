const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT
const Users = require('../model/Users');
const Karyawan = require('../model/Karyawan');

// Kunci rahasia untuk tanda tangan token (Simpan di .env di aplikasi nyata)
const JWT_SECRET = 'kode_rahasia_sangat_aman_123';

// --- ENDPOINT REGISTER ---
router.post('/register', async (req, res) => {
    try {
        let { id_karyawan, nama, email, pass } = req.body;

        if (!id_karyawan || !nama || !email || !pass) {
            return res.status(400).json({ status: false, message: 'Semua field harus diisi!' });
        }

        const karyawan = await Karyawan.findByKaryawanId(id_karyawan);
        if (!karyawan || karyawan.length === 0) {
            return res.status(404).json({ status: false, message: 'ID Karyawan tidak terdaftar.' });
        }

        const userById = await Users.findByKaryawanId(id_karyawan);
        if (userById && userById.length > 0) {
            return res.status(409).json({ status: false, message: 'ID Karyawan sudah memiliki akun.' });
        }

        let enkripsi = await bcrypt.hash(pass, 10);
        let Data = {
            nama,
            email,
            pass: enkripsi,
            id_karyawan: id_karyawan
        };
        await Users.Store(Data);

        return res.status(201).json({
            status: true,
            message: 'Berhasil Registrasi! Silahkan Login.'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Server Error saat registrasi.' });
    }
});

// --- ENDPOINT LOGIN ---
router.post('/login', async (req, res) => {
    let { email, pass } = req.body;

    try {
        let Data = await Users.Login(email);

        if (Data.length > 0) {
            let enkripsi = Data[0].pass;
            let cek = await bcrypt.compare(pass, enkripsi);

            if (cek) {
                // MEMBUAT TOKEN
                // Kita masukkan id dan role ke dalam payload token
                const token = jwt.sign(
                    {
                        userId: Data[0].id,
                        role: Data[0].role
                    },
                    JWT_SECRET,
                    { expiresIn: '24h' } // Token hangus dalam 24 jam
                );

                return res.status(200).json({
                    status: true,
                    message: 'Login Berhasil',
                    token: token, // Kirimkan token ini ke frontend/Postman
                    user: {
                        nama: Data[0].nama,
                        email: Data[0].email,
                        role: Data[0].role
                    }
                });
            } else {
                return res.status(401).json({ status: false, message: 'Email atau Password salah.' });
            }
        } else {
            return res.status(401).json({ status: false, message: 'Email atau Password salah.' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Terjadi error pada server.' });
    }
});

// Logout di JWT biasanya ditangani di sisi client (hapus token di storage)
// Tapi kita buatkan endpoint simpel untuk konfirmasi
router.get('/logout', function (req, res) {
    return res.status(200).json({
        status: true,
        message: 'Logout berhasil (Silahkan hapus token di sisi client)'
    });
});

module.exports = router;