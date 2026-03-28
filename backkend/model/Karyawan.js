const db = require("../config/db");

class Karyawan {
    static async getAll() {
        return new Promise((resolve, reject) => {
            db.query('select * from karyawan order by id desc', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    static async Store(Data) {
        return new Promise((resolve, reject) => {
            db.query('insert into karyawan set ?', Data, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    static async getId(Id) {
        return new Promise((resolve, reject) => {
            db.query('select * from karyawan where id = ' + Id, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
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


    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            db.query('update karyawan set ? where id = ' + id, Data, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    static async Delete(id) {
        return new Promise((resolve, reject) => {
            db.query('delete from karyawan where id_karyawan = ' + id, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // Fungsi baru untuk HAPUS wajah (dari Opsi 2)
    static DeleteFace(id) {
        return new Promise((resolve, reject) => {
            // Gunakan 'id' (primary key), BUKAN 'id_karyawan'
            const sql = "UPDATE karyawan SET wajah = NULL WHERE id = ?";
            db.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    // Fungsi baru untuk UPDATE wajah (dari Opsi 2)
    static UpdateFace(id, faceDescriptor) {
        return new Promise((resolve, reject) => {
            // Gunakan 'id' (primary key)
            const sql = "UPDATE karyawan SET wajah = ? WHERE id = ?";
            db.query(sql, [faceDescriptor, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static countAll() {
        return new Promise((resolve, reject) => {
            db.query('SELECT COUNT(*) AS total FROM karyawan', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0].total);
                }
            });
        });
    }
}




module.exports = Karyawan;