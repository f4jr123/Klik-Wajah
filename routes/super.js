var express = require('express');
var router = express.Router();
const Karyawan = require('../model/Karyawan');
const Users = require('../model/Users');
const Absensi = require('../model/Absensi');
const PengajuanAbsen = require('../model/PengajuanAbsen');
const moment = require('moment');

function formatTanggal(dateString) {
    if (!dateString) return '-';
    return moment(dateString).format('DD-MMM-YYYY');
}

/* GET super dashboard. */
router.get('/', async function (req, res, next) {
    try {
        let id = req.session.userId;
        if (!id) return res.redirect('/login');

        let DataUser = await Users.getId(id);
        if (!DataUser || DataUser.length === 0) return res.redirect('/login');

        // --- LOGIKA MENGAMBIL DATA DASHBOARD ---
        const [
            totalKaryawan,
            hadirHariIni,
            pengajuanPending,
            riwayatAbsensi // Berisi Array semua data absen hari ini
        ] = await Promise.all([
            Karyawan.countAll(),         // 1. Total Karyawan
            Absensi.countToday(),        // 2. Yang hadir hari ini (Total Angka)
            PengajuanAbsen.countPending(), // 3. Pengajuan pending
            Absensi.getToday()           // 4. Riwayat (Data Lengkap)
        ]);

        // --- [BARU] HITUNG DATA UNTUK GRAFIK DONUT ---
        // Kita looping data 'riwayatAbsensi' untuk memisahkan statusnya
        let stats = { hadir: 0, telat: 0, alpha: 0 };

        if (riwayatAbsensi && riwayatAbsensi.length > 0) {
            riwayatAbsensi.forEach(item => {
                if (item.status == 'hadir') stats.hadir++;
                else if (item.status == 'telat') stats.telat++;
                else if (item.status == 'alpha') stats.alpha++;
            });
        }
        // ---------------------------------------------

        // --- HITUNG PERSENTASE ---
        let persentase = 0;
        if (totalKaryawan > 0) {
            persentase = Math.round((hadirHariIni / totalKaryawan) * 100);
        }

        // Format data tabel (ambil 5 teratas untuk tabel dashboard)
        const formattedAbsensi = riwayatAbsensi.map(item => ({
            ...item,
            tanggal: formatTanggal(item.tanggal)
        })).slice(0, 5);

        // Cek Role
        if (DataUser[0].role != 'super') {
            return res.redirect('/logout');
        }

        // RENDER VIEW DENGAN DATA DINAMIS
        res.render('super/index', {
            nama: DataUser[0].nama,
            role: DataUser[0].role,

            // Data Dashboard
            jumlah_karyawan: totalKaryawan,
            jumlah_absen_hari_ini: hadirHariIni,
            persentase_kehadiran: persentase,
            jumlah_pengajuan: pengajuanPending,

            // Data Tabel
            data_absensi: formattedAbsensi,

            // [BARU] Data Grafik dikirim ke View
            statistik: stats 
        });

    } catch (error) {
        console.error("Error di Dashboard Super:", error);
        req.flash('error_msg', 'Terjadi kesalahan server.');
        res.redirect('/login');
    }
});

module.exports = router;