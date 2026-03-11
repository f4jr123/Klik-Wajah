var express = require('express');
const Divisi = require('../model/Divisi');
const Users = require('../model/Users');
var router = express.Router();

// MENAMPILKAN SEMUA DATA (MEMBACA PESAN)
router.get('/', async function (req, res, next) {
    try {
        let id = req.session.userId;
        let Data = await Users.getId(id);
        let rows = await Divisi.getAll();
        res.render('super/divisi', {
            nama: Data[0].nama,
            role: Data[0].role,
            data: rows,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        // Handle error jika user tidak login atau session habis
        req.flash('error_msg', 'Sesi Anda telah habis, silakan login kembali.');
        res.redirect('/login');
    }
});

// MENAMPILKAN FORM ADD (MEMBACA PESAN ERROR)
router.get('/add', async function (req, res, next) {
    try {
        let id = req.session.userId;
        let Data = await Users.getId(id);
        res.render('super/divisi/tambah', {
            nama: Data[0].nama,
            role: Data[0].role,
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        req.flash('error_msg', 'Sesi Anda telah habis, silakan login kembali.');
        res.redirect('/login');
    }
});

// PROSES TAMBAH (MENGATUR PESAN)
router.post('/tambah', async (req, res) => {
    try {
        let { nama_divisi } = req.body;
        let Data = { nama_divisi };
        await Divisi.Store(Data);

        // ATUR PESAN SUKSES
        req.flash('success_msg', 'Data divisi berhasil ditambahkan!');
        res.redirect('/divisi');

    } catch (err) {
        console.error(err);
        // ATUR PESAN GAGAL
        req.flash('error_msg', 'Gagal menambahkan data, terjadi kesalahan.');
        res.redirect('/divisi/add');
    }
});

// MENAMPILKAN FORM EDIT (MEMBACA PESAN ERROR)
router.get('/edit/(:id)', async function (req, res, next) {
    try {
        let id = req.session.userId;
        let Data = await Users.getId(id);
        let Id = req.params.id;
        let rows = await Divisi.getId(Id);
        res.render('super/divisi/edit', {
            data: rows[0],
            role: Data[0].role,
            nama: Data[0].nama,
            // AMBIL PESAN ERROR (JIKA GAGAL UPDATE)
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        req.flash('error_msg', 'Sesi Anda telah habis, silakan login kembali.');
        res.redirect('/login');
    }
});

// PROSES UPDATE (MENGATUR PESAN)
router.post('/update/(:id)', async function (req, res, next) {
    try {
        let id = req.params.id;
        let { nama_divisi } = req.body;
        let Data = { nama_divisi };
        await Divisi.Update(id, Data);

        // ATUR PESAN SUKSES
        req.flash('success_msg', 'Data divisi berhasil diperbarui!');
        res.redirect('/divisi');

    } catch (err) {
        console.error(err);
        // ATUR PESAN GAGAL
        req.flash('error_msg', 'Gagal memperbarui data.');
        res.redirect('/divisi/edit/' + req.params.id); // Kembali ke form edit
    }
});

// PROSES DELETE (MENGATUR PESAN)
router.get('/delete/(:id)', async function (req, res, next) {
    try {
        let id = req.params.id;
        await Divisi.Delete(id);
        req.flash('success_msg', 'Data divisi berhasil dihapus!');
        res.redirect('/divisi');

    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Gagal menghapus data.');
        res.redirect('/divisi');
    }
});

module.exports = router;