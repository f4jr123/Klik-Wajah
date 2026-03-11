const db = require("../config/db");

class Users {
    static async getAll() {
        return new Promise((resolve, reject) => {
            db.query('select * from users where role = "users" order by id desc', (err, rows) => {
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
            db.query('insert into users set ?', Data, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    static async Login(email) {
        return new Promise((resolve, reject) => {
            db.query('select * from users where email = ?', [email], function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    static async getId(id) {
        return new Promise((resolve, reject) => {
            db.query('select * from users where id = ' + id, (err, rows) => {
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
            db.query('update users set ? where id' + id, Data, function (err, result) {
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
            db.query('delete from users where id = ' + id, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async findEmail(email) {
        return new Promise((resolve, reject) => {
            db.query('select * from users where email = ?', [email], function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async findByKaryawanId(id_karyawan) {
        return new Promise((resolve, reject) => {
            db.query('select * from users where id_karyawan = ?', [id_karyawan], function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

}



module.exports = Users;