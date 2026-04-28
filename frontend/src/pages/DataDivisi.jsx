import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DataDivisi.css';

const DataDivisi = () => {
  // Mock data sesuai gambar
  const [dataDivisi] = useState([
    { id: 1, id_divisi: '000-18', nama_divisi: 'yo' },
    { id: 2, id_divisi: '000-10', nama_divisi: 'y' },
    { id: 3, id_divisi: '000-8', nama_divisi: 'yo1' },
  ]);

  return (
    <div className="container-fluid p-0 d-flex" style={{ backgroundColor: '#f8faff', minHeight: '100vh' }}>
      
      {/* SIDEBAR */}
      <Sidebar activePage="Divisi" />

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
          <div className="divisi-card-container shadow-lg">
          
          {/* Title & Action */}
          <div className="d-flex justify-content-between align-items-center mb-5 mt-2">
            <h5 className="text-white fw-bold m-0">Data Divisi</h5>
            <button className="btn-add-data">Add</button>
          </div>

          {/* Filter Bar */}
          <div className="d-flex justify-content-between align-items-center mb-4 text-white-50 small">
            <div className="d-flex align-items-center gap-2">
              Tampilkan 
              <select className="select-entries-custom">
                <option>10</option>
                <option>25</option>
              </select>
              data
            </div>
            <div className="d-flex align-items-center gap-2">
              Cari: <input type="text" className="input-search-custom" />
            </div>
          </div>

          {/* Data Table */}
          <div className="table-responsive">
            <table className="table table-divisi-dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID DIVISI</th>
                  <th>NAMA DIVISI</th>
                  <th className="text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {dataDivisi.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-bold text-center" style={{ width: '80px', color: 'white' }}>{item.id}</td>
                    <td style={{ color: 'white' }}>{item.id_divisi}</td>
                    <td style={{ color: 'white' }}>{item.nama_divisi}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn-table-action btn-edit-data">Edit</button>
                        <button className="btn-table-action btn-delete-data">Hapus</button>
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

export default DataDivisi;