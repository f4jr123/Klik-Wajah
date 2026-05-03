const express = require('express');
const router = express.Router();
const Absensi = require('../model/Absensi'); // Panggil Model
const moment = require('moment');

/**
 * POST /api/absensi/submit-presensi
 * Dipanggil React setelah Python AI sukses verifikasi
 */
router.post('/submit-presensi', async (req, res) => {
    try {
        const { id_karyawan, tipe_absen, nama_karyawan, pola_tangan } = req.body;
        const hariIni = moment().format('YYYY-MM-DD');

        // 1. Validasi Duplikasi: Cek apakah tipe absen yang SAMA sudah dilakukan hari ini
        const sudahAbsen = await Absensi.checkExisting(id_karyawan, hariIni, tipe_absen);
        if (sudahAbsen) {
            return res.status(400).json({
                success: false,
                message: `Anda sudah absen ${tipe_absen} hari ini.`
            });
        }

        // --- 2. 🛡️ ATURAN BARU: Cegah Absen Keluar Sebelum Absen Masuk ---
        if (tipe_absen === 'keluar') {
            // Kita pinjam fungsi checkExisting untuk mengecek absen 'masuk'
            const sudahAbsenMasuk = await Absensi.checkExisting(id_karyawan, hariIni, 'masuk');

            if (!sudahAbsenMasuk) {
                return res.status(400).json({
                    success: false,
                    message: "Ditolak! Anda belum absen masuk hari ini."
                });
            }
        }
        // -----------------------------------------------------------------

        // 3. Tentukan status (hadir/telat)
        let statusAbsen = 'hadir';
        if (tipe_absen === 'masuk') {
            const sekarang = moment();
            const batas = moment().set({ hour: 8, minute: 0, second: 0 });
            if (sekarang.isAfter(batas)) statusAbsen = 'telat';
        }

        // 4. Susun objek data sesuai kolom DB
        const payload = {
            id_karyawan: id_karyawan,
            tanggal: hariIni,
            jam_log: moment().format('YYYY-MM-DD HH:mm:ss'),
            tipe_absen: tipe_absen,
            status: statusAbsen,
            pola_tangan: pola_tangan || 'tidak_terdeteksi'
        };

        // 5. Eksekusi via Model
        await Absensi.Store(payload);

        res.json({
            success: true,
            message: `Presensi ${tipe_absen} berhasil dicatat!`,
            data: { nama: nama_karyawan, status: statusAbsen, waktu: moment().format('HH:mm:ss') }
        });

    } catch (err) {
        console.error("Error di route absensi:", err);
        res.status(500).json({ success: false, message: "Gagal menyimpan data." });
    }
});

module.exports = router;