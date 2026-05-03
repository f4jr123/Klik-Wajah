import React, { useState, useEffect } from 'react'; // Tambahkan useEffect
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import apiService from '../services/api';
import {
  LayoutDashboard, FileText, ListOrdered, Building2,
  Users, PieChart, Settings, ChevronLeft, ChevronRight, Plus, Search
} from 'lucide-react';

const KaryawanPage = () => {
  // 1. Inisialisasi state sebagai array kosong
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fungsi untuk mengambil data dari Backend
  const fetchKaryawan = async () => {
    try {
      setLoading(true);
      // Asumsi: apiService punya method getKaryawan. 
      // Jika belum ada, kita gunakan endpoint '/' yang Anda buat di router Express
      const response = await apiService.getKaryawan();

      if (response.data.status) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      alert("Gagal memuat data karyawan");
    } finally {
      setLoading(false);
    }
  };

  // 3. Jalankan fetch saat komponen pertama kali muncul
  useEffect(() => {
    fetchKaryawan();
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar activePage="Karyawan" />

      <div className="flex-grow-1">
        <div className="p-4 d-flex justify-content-between align-items-start"
          style={{ backgroundColor: '#6c63ff', height: '180px', color: 'white' }}>
          <h6 className="fw-bold m-0" style={{ letterSpacing: '1px' }}>SMART ATTANDANCE</h6>
          <div className="d-flex align-items-center gap-2">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=yona"
              alt="yona" className="rounded-circle border border-2 border-white" width="32"
            />
            <span className="small fw-medium">yona</span>
          </div>
        </div>

        <div className="container-fluid px-4" style={{ marginTop: '-80px' }}>
          <div className="card border-0 shadow-lg rounded-3 overflow-hidden"
            style={{ backgroundColor: '#1a2235', color: '#e2e8f0' }}>

            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0 fw-bold">Data Karyawan</h5>
                <button className="btn btn-primary px-4 d-flex align-items-center gap-2"
                  style={{ backgroundColor: '#5c54e5', border: 'none' }}
                  onClick={() => window.location.href = '/tambahkaryawan'}>
                  <Plus size={18} /> Add
                </button>
              </div>

              {/* Tabel Content */}
              <div className="table-responsive">
                {loading ? (
                  <div className="text-center py-5">Memuat data...</div>
                ) : (
                  <table className="table table-dark table-hover border-0 mb-0">
                    <thead className="text-muted border-secondary">
                      <tr style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                        <th className="bg-transparent py-3 text-uppercase fw-semibold">#</th>
                        <th className="bg-transparent py-3 text-uppercase fw-semibold">ID Karyawan</th>
                        <th className="bg-transparent py-3 text-uppercase fw-semibold">Nama Karyawan</th>
                        <th className="bg-transparent py-3 text-uppercase fw-semibold">Divisi</th>
                        <th className="bg-transparent py-3 text-uppercase fw-semibold">Manajemen Wajah</th>
                        <th className="bg-transparent py-3 text-uppercase fw-semibold text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="border-0">
                      {employees.map((emp, index) => (
                        <tr key={emp.id} className="align-middle border-secondary">
                          <td className="bg-transparent py-4 ps-3 text-secondary">{index + 1}</td>
                          <td className="bg-transparent fw-medium">{emp.id_karyawan}</td>
                          <td className="bg-transparent">{emp.nama_karyawan}</td>
                          <td className="bg-transparent">{emp.nama_divisi || emp.id_divisi}</td>
                          <td className="bg-transparent">
                            <div className="d-flex flex-column gap-2">
                              <div className="small d-flex align-items-center gap-2">
                                {/* Logika Status: Jika ada face_embedding maka "Terdaftar" */}
                                <span className={`p-1 rounded-circle shadow-sm ${emp.face_embedding ? 'bg-success' : 'bg-danger'}`}></span>
                                {emp.face_embedding ? 'Terdaftar' : 'Belum Scan'}
                              </div>
                              <div className="d-flex gap-1">
                                <button className="btn btn-primary btn-sm py-0 px-2" style={{ fontSize: '10px' }}>Reg. Ulang</button>
                              </div>
                            </div>
                          </td>
                          <td className="bg-transparent text-center px-3">
                            <div className="d-flex justify-content-center gap-2">
                              <button className="btn btn-info btn-sm text-white px-3 fw-medium">Edit</button>
                              <button className="btn btn-sm px-3 fw-medium text-white"
                                style={{ backgroundColor: '#ff6b4a' }}>Hapus</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination Info */}
              <div className="d-flex justify-content-between align-items-center mt-4 small text-secondary">
                <span>Menampilkan {employees.length} data</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaryawanPage;