import React from 'react';
import Sidebar from '../components/Sidebar';
import { Trash2, History } from 'lucide-react';
import './pengajuan-absen.css';

const PengajuanAbsen = () => {
  const dataPengajuan = [
    {
      no: 1,
      nama: 'Yona',
      tglMulai: '20-Nov-2025',
      tglSelesai: '21-Nov-2025',
      tipe: 'izin',
      status: 'Pending',
      lampiran: '-'
    }
  ];

  return (
    <div className="container-fluid p-0 d-flex" style={{ backgroundColor: '#f8faff', minHeight: '100vh' }}>
      
      {/* SIDEBAR */}
      <Sidebar activePage="Pengajuan Absen" />

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
          <div className="card-dark-table shadow-lg">
          {/* Bagian Atas Tabel */}
          <div className="d-flex justify-content-between align-items-center mb-4 p-2">
            <h5 className="text-white fw-bold m-0">Manajemen Pengajuan Absen</h5>
            <button className="btn-riwayat">
              <History size={16} />
              Riwayat Absen
            </button>
          </div>

          {/* Tabel Manajemen */}
          <div className="table-responsive">
            <table className="table table-dark-custom">
              <thead>
                <tr>
                  <th>NO</th>
                  <th>NAMA KARYAWAN</th>
                  <th>TGL MULAI</th>
                  <th>TGL SELESAI</th>
                  <th>TIPE</th>
                  <th>STATUS</th>
                  <th>LAMPIRAN</th>
                  <th className="text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {dataPengajuan.map((item, index) => (
                  <tr key={index}>
                    <td className="fw-bold" style={{ color: 'white' }}>{item.no}</td>
                    <td style={{ color: 'white' }}>{item.nama}</td>
                    <td style={{ color: 'white' }}>{item.tglMulai}</td>
                    <td style={{ color: 'white' }}>{item.tglSelesai}</td>
                    <td style={{ color: 'white' }}>{item.tipe}</td>
                    <td>
                      <div className="status-pending">
                        <span className="dot-orange"></span>
                        <span style={{ color: 'white' }}>{item.status}</span>
                      </div>
                    </td>
                    <td className="text-muted" style={{ color: 'white' }}>{item.lampiran}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn-verifikasi">Verifikasi</button>
                        <button className="btn-hapus">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default PengajuanAbsen;