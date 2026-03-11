let mysql = require('mysql');
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fp_absensi',
});

db.connect(function (error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log('Connection Success')
    }
});

module.exports = db;