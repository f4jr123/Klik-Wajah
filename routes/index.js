var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');

var Users = require('../model/Users');
var Karyawan = require('../model/Karyawan');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function (req, res, next) {
  res.render('auth/register', {
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg'),
    error: req.flash('error')
  });
});

router.get('/login', function (req, res, next) {
  res.render('auth/login', {
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg'),
    error: req.flash('error')
  });
});

router.post('/saveusers', async (req, res) => {
  try {
    let { id_karyawan, nama, email, pass } = req.body;

    if (!id_karyawan || !nama || !email || !pass) {
      req.flash('error_msg', 'Semua field harus diisi!');
      return res.redirect('/register');
    }

    const karyawan = await Karyawan.findByKaryawanId(id_karyawan);

    if (!karyawan || karyawan.length === 0) {
      req.flash('error_msg', 'ID Karyawan tidak terdaftar.');
      return res.redirect('/register');
    }

    const userById = await Users.findByKaryawanId(id_karyawan);

    if (userById && userById.length > 0) {
      req.flash('error_msg', 'ID Karyawan ini sudah terdaftar dan memiliki akun.');
      return res.redirect('/register');
    }

    let enkripsi = await bcrypt.hash(pass, 10);
    let Data = {
      nama,
      email,
      pass: enkripsi,
      id_karyawan: id_karyawan
    };
    await Users.Store(Data);

    req.flash('success_msg', 'Berhasil Registrasi! Silahkan Login..');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan saat registrasi.');
    res.redirect('/register');
  }
});

router.post('/log', async (req, res) => {
  let { email, pass } = req.body;
  try {
    let Data = await Users.Login(email);

    // 1. CEK JIKA EMAIL DITEMUKAN
    if (Data.length > 0) {
      let enkripsi = Data[0].pass;
      let cek = await bcrypt.compare(pass, enkripsi);

      // 2. CEK JIKA PASSWORD COCOK
      if (cek) {
        // --- LOGIN SUKSES ---
        req.session.userId = Data[0].id;
        if (Data[0].role == 'super') {
          // Gunakan 'success_msg' sesuai EJS Anda
          req.flash('success_msg', 'Berhasil Login');
          res.redirect('/super');
        } else if (Data[0].role == 'users') {
          req.flash('success_msg', 'Berhasil Login');
          res.redirect('/users');
        } else {
          // Error jika role tidak dikenal
          req.flash('error_msg', 'Role pengguna tidak valid.');
          res.redirect('/login');
        }
      } else {
        req.flash('error_msg', 'Email atau Password salah.');
        res.redirect('/login');
      }
    } else {
      req.flash('error_msg', 'Email atau Password salah.');
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi error pada server.');
    res.redirect('/login');
  }
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/login');
    }
  });
});

module.exports = router;