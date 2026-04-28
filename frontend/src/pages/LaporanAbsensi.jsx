import React, { useState } from 'react';
import { Search, FileSpreadsheet, FileText } from 'lucide-react';
import './LaporanAbsensi.css';

const LaporanAbsensi = () => {
  const [reportData] = useState([
    { no: 1, tanggal: '28/04/2026', nama: 'fagri', divisi: 'yo1', checkin: '11:16:49', checkout: '-', status: 'TELAT' }
  ]);

  return (
    <div className="report-page-wrapper">
      {/* Navbar Header */}
      <header className="report-header-purple">
        <div className="d-flex justify-content-between align-items-center px-4 pt-3">
          <span className="brand-text">SMART ATTANDANCE</span>
          <div className="user-profile-nav">
            <img src="https://ui-avatars.com/api/?name=Yona&background=random" alt="user" />
            <span>yona</span>
          </div>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="container-fluid px-4 report-content-overlap">
        <div className="report-card-container shadow-lg">
          <h5 className="text-white fw-bold mb-5 mt-2">Rekap Laporan Absensi</h5>

          {/* Filter Row */}
          <div className="row g-3 mb-5 align-items-end">
            <div className="col-md-2">
              <label className="filter-label">Tanggal Mulai</label>
              <input type="date" className="form-control filter-input" defaultValue="2026-04-01" />
            </div>
            <div className="col-md-2">
              <label className="filter-label">Tanggal Selesai</label>
              <input type="date" className="form-control filter-input" defaultValue="2026-04-30" />
            </div>
            <div className="col-md-2">
              <label className="filter-label">Divisi</label>
              <select className="form-select filter-input">
                <option>Semua Divisi</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="filter-label">Status</label>
              <select className="form-select filter-input">
                <option>Semua Status</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="filter-label">Urutkan</label>
              <select className="form-select filter-input">
                <option>Terbaru</option>
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn-filter-apply w-100">
                <Search size={16} /> Filter
              </button>
            </div>
          </div>

          <hr className="border-secondary opacity-25 mb-4" />

          {/* Table Header & Export Buttons */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6 className="text-white fw-bold m-0">Hasil Laporan</h6>
            <div className="d-flex gap-2">
              <button className="btn-export excel">
                <FileSpreadsheet size={16} /> Excel
              </button>
              <button className="btn-export pdf">
                <FileText size={16} /> PDF
              </button>
            </div>
          </div>

          {/* Result Table */}
          <div className="table-responsive">
            <table className="table table-report-dark">
              <thead>
                <tr>
                  <th>NO</th>
                  <th>TANGGAL</th>
                  <th>NAMA</th>
                  <th>DIVISI</th>
                  <th>CHECK IN</th>
                  <th>CHECK OUT</th>
                  <th className="text-center">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{item.no}</td>
                    <td>{item.tanggal}</td>
                    <td>{item.nama}</td>
                    <td>{item.divisi}</td>
                    <td>{item.checkin}</td>
                    <td>{item.checkout}</td>
                    <td className="text-center">
                      <span className="badge-telat-small">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LaporanAbsensi;