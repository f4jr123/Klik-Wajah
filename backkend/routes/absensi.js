var express = require('express');
var router = express.Router();
const Absensi = require('../model/Absensi');
const moment = require('moment');

/**
 * POST /absensi/submit-presensi
 * Alur: React -> Python (AI) -> Express (Endpoint ini)
 */
router.post('/submit-presensi', async (req, res) => {
    try {
        const { id_karyawan, tipe_absen, nama_karyawan } = req.body;

        // 1. Validasi Input
        if (!id_karyawan || !tipe_absen) {
            return res.status(400).json({
                success: false,
                message: "Data id_karyawan atau tipe_absen tidak boleh kosong."
            });
        }

        const hariIni = moment().format('YYYY-MM-DD');

        // 2. Cek apakah user sudah absen tipe ini (masuk/keluar) di hari yang sama
        // Pastikan di model Absensi kamu sudah ada fungsi checkExisting
        const sudahAbsen = await Absensi.checkExisting(id_karyawan, hariIni, tipe_absen);

        if (sudahAbsen) {
            return res.status(400).json({
                success: false,
                message: `Anda sudah melakukan presensi ${tipe_absen} hari ini.`
            });
        }

        // 3. Logika Penentuan Status (Hadir/Telat)
        // Hanya berlaku untuk tipe_absen 'masuk'
        let statusAbsen = 'hadir';
        if (tipe_absen === 'masuk') {
            const sekarang = moment();
            const jamMasukKantor = moment().set({ hour: 8, minute: 0, second: 0 }); // Batas jam 08:00

            if (sekarang.isAfter(jamMasukKantor)) {
                statusAbsen = 'telat';
            }
        }

        // 4. Susun data sesuai kolom di gambar database kamu
        const dataPresensi = {
            id_karyawan: id_karyawan,
            tanggal: hariIni,
            jam_log: moment().format('YYYY-MM-DD HH:mm:ss'), // Format DATETIME
            tipe_absen: tipe_absen, // 'masuk' atau 'keluar'
            status: statusAbsen,
            pola_tangan: 'jempol' // Default atau kirim dari React jika ada fiturnya
        };

        // 5. Simpan ke database
        await Absensi.Store(dataPresensi);

        // 6. Respon balik ke React
        res.json({
            success: true,
            message: `Presensi ${tipe_absen} berhasil dicatat!`,
            data: {
                nama: nama_karyawan,
                waktu: moment().format('HH:mm:ss'),
                status: statusAbsen
            }
        });

    } catch (err) {
        console.error("Error Presensi:", err);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server saat mencatat presensi."
        });
    }
});

module.exports = router;