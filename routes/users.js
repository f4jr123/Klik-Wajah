var express = require('express');
var router = express.Router();
const Users = require('../model/Users');
const Absensi = require('../model/Absensi');
const moment = require('moment');

// --- Format Tanggal Helper ---
function formatTanggal(dateString) {
  if (!dateString) return '-';
  return moment(dateString).format('DD/MM/YYYY');
}

router.get('/', async function (req, res, next) {
  try {
    let id = req.session.userId;
    if (!id) return res.redirect('/login');

    let Data = await Users.getId(id);

    if (Data.length > 0) {
      if (Data[0].role != 'users') return res.redirect('/logout');

      let id_karyawan = Data[0].id_karyawan;

      // Variable Data untuk View
      let formattedAbsensi = [];
      let stats = { hadir: 0, telat: 0, izin: 0, alpha: 0 };
      let dataHariIni = null;

      if (id_karyawan) {
        let riwayatAbsensi = await Absensi.getByKaryawan(id_karyawan);

        // --- SETUP TANGGAL HARI INI & BULAN INI ---
        const todayStr = moment().format("YYYY-MM-DD");
        const currentMonth = moment().format("MM-YYYY");

        formattedAbsensi = riwayatAbsensi.map(item => {
          let durasi = "-";
          const tglItem = moment(item.tanggal).format("YYYY-MM-DD");
          const blnItem = moment(item.tanggal).format("MM-YYYY");

          // 1. CEK APAKAH INI DATA HARI INI?
          if (tglItem === todayStr) {
            dataHariIni = item;
          }

          // 2. HITUNG STATISTIK BULAN INI
          if (blnItem === currentMonth) {
            if (item.status === 'hadir') stats.hadir++;
            else if (item.status === 'telat') stats.telat++;
            else if (item.status === 'alpha') stats.alpha++;
            else if (item.status === 'izin' || item.status === 'sakit' || item.status === 'cuti') stats.izin++;
          }

          // 3. HITUNG DURASI KERJA (Logic Anti-Gagal)
          if (item.checkin && item.checkout) {
            try {
              // Helper extract
              const extractTime = (val) => {
                let m = moment(val, "HH:mm:ss");
                if (!m.isValid()) m = moment(val);
                return m.isValid() ? m.format("HH:mm:ss") : null;
              };
              let jamIn = extractTime(item.checkin);
              let jamOut = extractTime(item.checkout);

              if (jamIn && jamOut) {
                let masuk = moment(`${tglItem} ${jamIn}`, "YYYY-MM-DD HH:mm:ss");
                let pulang = moment(`${tglItem} ${jamOut}`, "YYYY-MM-DD HH:mm:ss");
                let diff = moment.duration(pulang.diff(masuk));
                let jam = Math.floor(diff.asHours());
                let menit = Math.floor(diff.asMinutes()) % 60;
                if (!isNaN(jam) && jam >= 0) durasi = `${jam} Jam ${menit} Menit`;
              }
            } catch (e) { }
          }

          return {
            ...item,
            tanggal: formatTanggal(item.tanggal),
            checkin: item.checkin || '-',
            checkout: item.checkout || '-',
            lama_kerja: durasi
          };
        });
      }

      res.render('users/index', {
        nama: Data[0].nama,
        role: Data[0].role,
        data: formattedAbsensi, // Untuk Tabel
        statistik: stats,       // Untuk Kartu Atas
        hari_ini: dataHariIni,  // Untuk Kartu Tengah
        success_msg: req.flash('success_msg')
      });

    } else {
      res.redirect('/login');
    }

  } catch (error) {
    console.error("Error di /users:", error);
    res.redirect('/login');
  }
});

module.exports = router;