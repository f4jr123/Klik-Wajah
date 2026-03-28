const db = require("../config/db");

class Divisi {
    static async getAll() {
        return new Promise((resolve, reject) => {
            db.query('select * from divisi order by id_divisi desc', (err, rows) => {
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
            db.query('insert into divisi set ?', Data, function (err, result) {
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
            db.query('select * from divisi where id_divisi = ' + Id, (err, rows) => {
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
            db.query('update divisi set ? where id_divisi = ' + id, Data, function (err, result) {
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
            db.query('delete from divisi where id_divisi = ' + id, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Divisi;