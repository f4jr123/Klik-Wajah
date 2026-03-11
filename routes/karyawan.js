var express = require('express');
const Divisi = require('../model/Divisi');
const Karyawan = require('../model/Karyawan');
const Users = require('../model/Users');
var router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        let id = req.session.userId;
        let Data = await Users.getId(id);
        let rows = await Karyawan.getAll();
        res.render('super/karyawan', {
            nama: Data[0].nama,
            role: Data[0].role,
            data: rows,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        req.flash('error_msg', 'Sesi Anda telah habis, silakan login kembali.');
        res.redirect('/login');
    }
});

router.get('/add', async function (req, res, next) {
    try {
        let id = req.session.userId;
        let Data = await Users.getId(id);
        let row = await Divisi.getAll();
        res.render('super/karyawan/tambah', {
            nama: Data[0].nama,
            role: Data[0].role,
            rows: row,
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        req.flash('error_msg', 'Sesi Anda telah habis, silakan login kembali.');
        res.redirect('/login');
    }
});

router.post('/tambah', async (req, res) => {
    try {
        let { id, id_karyawan, nama_karyawan, id_divisi, faceDescriptor } = req.body;

        if (!faceDescriptor || faceDescriptor.length <= 2) {
            console.log("Data wajah (faceDescriptor) tidak terkirim.");
            req.flash('error_msg', 'Data wajah tidak terdeteksi. Silakan coba lagi.');
            return res.redirect('back');
        }

        if (id) {
            // Mode Registrasi Ulang
            console.log(`Mode Registrasi Ulang untuk ID: ${id}`);

            await Karyawan.UpdateFace(id, faceDescriptor);
            req.flash('success_msg', 'Wajah karyawan berhasil diregistrasi ulang!');
        } else {
            // Mode Tambah Karyawan Baru
            console.log("Mode Tambah Karyawan Baru");
            let Data = {
                id_karyawan,
                nama_karyawan,
                id_divisi,
                wajah: faceDescriptor
            };
            await Karyawan.Store(Data);
            req.flash('success_msg', 'Karyawan baru berhasil ditambahkan!');
        }
        res.redirect('/karyawan');

    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Gagal menyimpan data. Pastikan ID Karyawan unik.');
        res.redirect('back');
    }
});

router.get('/edit/:id', async function (req, res, next) {
    try {
        let id = req.session.userId;
        let DataUser = await Users.getId(id);

        let Id = req.params.id;
        let dataKaryawan = await Karyawan.getId(Id);
        let dataDivisi = await Divisi.getAll();

        if (!dataKaryawan || dataKaryawan.length === 0) {
            req.flash('error_msg', 'Data karyawan tidak ditemukan.');
            return res.redirect('/karyawan');
        }

        res.render('super/karyawan/edit', {
            nama: DataUser[0].nama,
            role: DataUser[0].role,
            data: dataKaryawan[0],
            rows: dataDivisi,
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Sesi Anda telah habis, silakan login kembali.');
        res.redirect('/login');
    }
});

router.post('/update/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let { id_karyawan, nama_karyawan, id_divisi } = req.body;
        let Data = {
            id_karyawan,
            nama_karyawan,
            id_divisi
        };
        await Karyawan.Update(id, Data);

        req.flash('success_msg', 'Data karyawan berhasil diperbarui!');
        res.redirect('/karyawan');

    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Gagal memperbarui data. Pastikan ID Karyawan unik.');
        res.redirect('/karyawan/edit/' + req.params.id);
    }
});

router.get('/delete/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        await Karyawan.Delete(id);

        req.flash('success_msg', 'Data karyawan berhasil dihapus.');
        res.redirect('/karyawan');

    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Gagal menghapus data.');
        res.redirect('/karyawan');
    }
});

router.get('/delete-face/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        await Karyawan.DeleteFace(id);

        console.log(`Wajah untuk karyawan ${id} telah dihapus.`);
        req.flash('success_msg', 'Data wajah karyawan berhasil dihapus.');
        res.redirect('/karyawan');

    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Gagal menghapus data wajah.');
        res.redirect('/karyawan');
    }
});

router.get('/re-register/:id', async function (req, res, next) {
    try {
        let id = req.session.userId;
        let DataUser = await Users.getId(id);

        let Id = req.params.id;
        let dataKaryawan = await Karyawan.getId(Id);

        let dataDivisi = await Divisi.getAll();

        if (!dataKaryawan || dataKaryawan.length === 0) {
            req.flash('error_msg', 'Data karyawan tidak ditemukan.');
            return res.redirect('/karyawan');
        }

        // Render halaman tambah.ejs dengan data yg sudah ada
        res.render('super/karyawan/tambah', {
            nama: DataUser[0].nama,
            role: DataUser[0].role,
            rows: dataDivisi,
            dataKaryawan: dataKaryawan[0],
            error_msg: req.flash('error_msg')
        });

    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Sesi Anda telah habis, silakan login kembali.');
        res.redirect('/login');
    }
});

module.exports = router;