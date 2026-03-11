var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var flash = require('express-flash');
var session = require('express-session');
const cron = require('node-cron');
const MemoryStore = require('session-memory-store')(session);

const Absensi = require('./model/Absensi');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var superRouter = require('./routes/super');
var karyawanRouter = require('./routes/karyawan');
var divisiRouter = require('./routes/divisi');
var manageUserRouter = require('./routes/manage');
var absensiRouter = require('./routes/absensi');
var pengajuanRouter = require('./routes/pengajuan-absen');
var laporanRouter = require('./routes/laporan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookie: {
    maxAge: 600000000000,
    secure: false,
    httpOnly: true,
    sameSite: 'strict',
  },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: true,
  secret: 'secret'
}));
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.error = req.flash('error'); // Untuk kompatibilitas jika Anda menggunakan passport.js
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/super', superRouter);
app.use('/karyawan', karyawanRouter);
app.use('/divisi', divisiRouter);
app.use('/manage', manageUserRouter);
app.use('/absensi', absensiRouter);
app.use('/pengajuan', pengajuanRouter);
app.use('/laporan', laporanRouter);

console.log("Penjadwal 'alpha' sedang dikonfigurasi...");
// Ini adalah tugas terjadwal.
// '1 17 * * *' = Menit 1, Jam 17 (5:01 PM), Setiap hari.
cron.schedule('1 17 * * *', async () => {
  console.log(`[CRON JOB START] Pukul 17:01 - Memulai pengecekan 'alpha'...`);

  try {
    // Panggil fungsi Model yang sudah kamu buat
    const result = await Absensi.markAlphaForAbsentees();

    // result.affectedRows adalah jumlah karyawan yg di-INSERT 'alpha'
    console.log(`[CRON JOB SUCCESS] Selesai. ${result.affectedRows} karyawan ditandai 'alpha'.`);

  } catch (err) {
    console.error("[CRON JOB FAILED] Gagal menjalankan tugas 'alpha':", err);
  }
}, {
  scheduled: true,
  timezone: "Asia/Jakarta" // WAJIB: Atur zona waktu ke WIB
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
