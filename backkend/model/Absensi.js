const db = require("../config/db");

class Absensi {
    static async getAll() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT a.*, k.nama_karyawan 
                FROM absensi a
                JOIN karyawan k ON a.id_karyawan = k.id_karyawan 
                ORDER BY a.jam_log DESC
            `;
            db.query(query, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // --- READ: Ambil Berdasarkan ID Absensi (Untuk Edit) ---
    static async getId(Id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM absensi WHERE id = ?', [Id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // --- CREATE: Simpan Data Presensi Baru ---
    static async Store(Data) {
        return new Promise((resolve, reject) => {
            // Data harus berisi: id_karyawan, tanggal, jam_log, tipe_absen, status, pola_tangan
            db.query('INSERT INTO absensi SET ?', Data, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    // --- UPDATE: Perbarui Data Absensi ---
    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE absensi SET ? WHERE id = ?', [Data, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    // --- DELETE: Hapus Data Absensi ---
    static async Delete(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM absensi WHERE id = ?', [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    // --- VALIDASI: Cek Apakah Sudah Absen Hari Ini (Mencegah Duplikat) ---
    static async checkExisting(id_karyawan, tanggal, tipe_absen) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM absensi 
                WHERE id_karyawan = ? 
                  AND tanggal = ? 
                  AND tipe_absen = ? 
                LIMIT 1
            `;
            db.query(sql, [id_karyawan, tanggal, tipe_absen], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
    }

    // --- READ: Riwayat Khusus Satu Karyawan (Untuk Dashboard User) ---
    static async getByKaryawan(id_karyawan) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM absensi 
                WHERE id_karyawan = ? 
                ORDER BY tanggal DESC, jam_log DESC
            `;
            db.query(query, [id_karyawan], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // --- FILTER: Riwayat Berdasarkan Bulan dan Tahun ---
    static async getHistoryFiltered(id_karyawan, bulan, tahun) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM absensi 
                WHERE id_karyawan = ? 
                  AND MONTH(tanggal) = ? 
                  AND YEAR(tanggal) = ?
                ORDER BY tanggal DESC
            `;
            db.query(query, [id_karyawan, bulan, tahun], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    /**
     * Menyimpan data presensi baru (Baik masuk maupun keluar)
     * Sesuai kolom: id_karyawan, tanggal, jam_log, tipe_absen, status, pola_tangan
     */
    static async Store(Data) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO absensi SET ?', Data, function (err, result) {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    /**
     * Cek apakah karyawan sudah melakukan tipe absen tertentu hari ini
     * Digunakan untuk validasi agar tidak double absen
     */
    static async checkExisting(id_karyawan, tanggal, tipe_absen) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM absensi 
                WHERE id_karyawan = ? 
                  AND tanggal = ? 
                  AND tipe_absen = ? 
                LIMIT 1
            `;
            db.query(sql, [id_karyawan, tanggal, tipe_absen], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
    }

    // Fungsi untuk mengambil riwayat berdasarkan ID Karyawan (untuk view user)
    static async getByKaryawan(id_karyawan) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM absensi 
                WHERE id_karyawan = ? 
                ORDER BY tanggal DESC, jam_log DESC
            `;
            db.query(query, [id_karyawan], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = Absensi;