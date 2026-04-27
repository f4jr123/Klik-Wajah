const db = require("../config/db");

class Karyawan {
    // 1. Mengambil semua karyawan (dengan join divisi agar HRD bisa lihat nama divisi)
    static async getAllWithDivisi() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT karyawan.*, divisi.nama_divisi 
                FROM karyawan 
                LEFT JOIN divisi ON karyawan.id_divisi = divisi.id_divisi 
                ORDER BY karyawan.id DESC`;
            db.query(sql, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // 2. Simpan karyawan baru (Mendukung NIK, Foto, dan Face_Embedding)
    static async Store(Data) {
        return new Promise((resolve, reject) => {
            // Skema 'Data' harus berisi: id_karyawan, nik, nama_karyawan, id_divisi, foto, face_embedding
            db.query('INSERT INTO karyawan SET ?', Data, function (err, result) {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    // 3. Ambil data biometrik saja untuk SINKRONISASI AI (Anti-Lag)
    static async getEmbeddings() {
        return new Promise((resolve, reject) => {
            // Hanya ambil kolom yang diperlukan agar query kencang
            const sql = 'SELECT id, nik, nama_karyawan, face_embedding FROM karyawan WHERE status = "aktif"';
            db.query(sql, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // 4. Update Wajah & Foto (Untuk Registrasi Ulang)
    static async UpdateFace(id, updateData) {
        return new Promise((resolve, reject) => {
            // updateData bisa berisi { face_embedding: ..., foto: ... }
            const sql = "UPDATE karyawan SET ? WHERE id = ?";
            db.query(sql, [updateData, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    // 5. Pencarian berdasarkan Primary Key (id)
    static async getId(Id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM karyawan WHERE id = ?', [Id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // 6. Update Data Umum Karyawan
    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE karyawan SET ? WHERE id = ?', [Data, id], function (err, result) {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    // 7. Hapus Karyawan (Gunakan ID Karyawan atau Primary Key)
    static async Delete(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM karyawan WHERE id = ?', [id], function (err, result) {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    // 8. Hitung Total (Untuk Statistik Dashboard)
    static countAll() {
        return new Promise((resolve, reject) => {
            db.query('SELECT COUNT(*) AS total FROM karyawan', (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0].total);
            });
        });
    }

    static async findByKaryawanId(id_karyawan) {
        return new Promise((resolve, reject) => {
            db.query('select * from karyawan where id_karyawan = ?', [id_karyawan], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = Karyawan;