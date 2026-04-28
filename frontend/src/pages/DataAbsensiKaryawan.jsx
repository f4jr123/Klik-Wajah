import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Edit3, Trash2, ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import './DataAbsensiKaryawan.css';

const DataAbsensiKaryawan = () => {
  // Mock data sesuai gambar
  const [dataAbsensi] = useState([
    { id: 1, id_kar: '13', nama: 'fagri', tgl: '28-Apr-2026', checkin: '11:16:49', checkout: '-', durasi: '-', status: 'TELAT' },
    { id: 2, id_kar: '909584', nama: 'yonac35', tgl: '21-Nov-2025', checkin: '08:27:57', checkout: '-', durasi: '-', status: 'TELAT' },
    { id: 3, id_kar: '1234', nama: 'Yona', tgl: '20-Nov-2025', checkin: '09:36:08', checkout: '19:19:55', durasi: '9 Jam 43 Menit', status: 'HADIR' },
  ]);

  return (
    <div className="container-fluid p-0 d-flex" style={{ backgroundColor: '#f8faff', minHeight: '100vh' }}>
      
      {/* SIDEBAR */}
      <Sidebar activePage="Absensi" />

      {/* MAIN CONTENT */}
      <main className="flex-grow-1">
        
        {/* HEADER PURPLE */}
        <header className="p-4 d-flex justify-content-between align-items-start" 
          style={{ backgroundColor: '#8a70ff', height: '180px', color: 'white' }}>
          <span className="fw-semibold tracking-wide">SMART ATTANDANCE</span>
          <div className="d-flex align-items-center gap-2">
            <img 
              src="https://ui-avatars.com/api/?name=Yona&background=random" 
              alt="user" 
              className="rounded-circle"
              style={{ width: '40px', height: '40px' }}
            />
            <span>yona</span>
          </div>
        </header>

        {/* KONTEN UTAMA (FLOATING) */}
        <div className="px-4" style={{ marginTop: '-70px' }}>
          <div className="absensi-card-container shadow-lg">
          
          {/* Title & Action */}
          <div className="d-flex justify-content-between align-items-center mb-5 mt-2">
            <h5 className="text-white fw-bold m-0">Data Absensi Karyawan</h5>
            <button className="btn-add-data">Add</button>
          </div>

          {/* Filter Bar */}
          <div className="d-flex justify-content-between align-items-center mb-4 text-white-50 small">
            <div className="d-flex align-items-center gap-2">
              Tampilkan 
              <select className="select-entries-custom">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              data
            </div>
            <div className="d-flex align-items-center gap-2 position-relative">
              Cari: <input type="text" className="input-search-custom" />
            </div>
          </div>

          {/* Data Table */}
          <div className="table-responsive">
            <table className="table table-absensi-dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID KARYAWAN</th>
                  <th>NAMA KARYAWAN</th>
                  <th>TANGGAL</th>
                  <th>CHECKIN</th>
                  <th>CHECKOUT</th>
                  <th>DURASI KERJA</th>
                  <th>STATUS</th>
                  <th className="text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {dataAbsensi.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-bold text-center" style={{ color: 'white' }}>{item.id}</td>
                    <td style={{ color: 'white' }}>{item.id_kar}</td>
                    <td style={{ color: 'white' }}>{item.nama}</td>
                    <td style={{ color: 'white' }}>{item.tgl}</td>
                    <td style={{ color: 'white' }}>{item.checkin}</td>
                    <td style={{ color: 'white' }}>{item.checkout}</td>
                    <td style={{ color: 'white' }}>{item.durasi}</td>
                    <td>
                      <span className={`status-label ${item.status === 'TELAT' ? 'st-telat' : 'st-hadir'}`} style={{ color: 'white' }}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn-table-action btn-edit-data">
                          <Edit3 size={12} /> Edit
                        </button>
                        <button className="btn-table-action btn-delete-data">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination & Info */}
          <div className="d-flex justify-content-between align-items-center mt-4 text-white-50 small">
            <p className="m-0 text-muted">Menampilkan 1 s/d 3 dari 3 data</p>
            <div className="pagination-nav d-flex gap-2">
              <button className="pagination-btn-circle"><ChevronLeft size={16} /></button>
              <button className="pagination-btn-circle active">1</button>
              <button className="pagination-btn-circle"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default DataAbsensiKaryawan;