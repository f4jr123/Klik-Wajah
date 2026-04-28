const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../model/Users');
const Karyawan = require('../model/Karyawan');

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
            return res.status(409).json({ status: false, message: 'ID Karyawan sudah terdaftar.' });
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
            message: 'Berhasil Registrasi!'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Terjadi kesalahan pada server.' });
    }
});

// --- ENDPOINT LOGIN ---
router.post('/login', async (req, res) => {
    const { email, pass } = req.body;

    try {
        const Data = await Users.Login(email);

        if (Data.length > 0) {
            const isMatch = await bcrypt.compare(pass, Data[0].pass);

            if (isMatch) {
                // Membuat Token dengan Secret dari .env
                const token = jwt.sign(
                    {
                        userId: Data[0].id,
                        role: Data[0].role
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                return res.status(200).json({
                    status: true,
                    message: 'Login Berhasil',
                    token: token,
                    user: {
                        id: Data[0].id,
                        nama: Data[0].nama,
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
        return res.status(500).json({ status: false, message: 'Server Error.' });
    }
});

// Endpoint: GET /api/auth/logout
router.get('/logout', function (req, res) {
    return res.status(200).json({
        status: true,
        message: 'Logout berhasil. Silakan hapus token dari Local Storage frontend.'
    });
});

module.exports = router;