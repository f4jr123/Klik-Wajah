import React from 'react';
import Sidebar from '../components/Sidebar';
import { 
  LayoutDashboard, 
  FileText, 
  List, 
  Building2, 
  Users, 
  PieChart, 
  Settings 
} from 'lucide-react';

const Home = () => {

  return (
    <div className="container-fluid p-0 d-flex" style={{ backgroundColor: '#f8faff', minHeight: '100vh' }}>
      
      {/* SIDEBAR */}
      <Sidebar activePage="Dashboard" />

      {/* MAIN CONTENT */}
      <main className="flex-grow-1">
        
        {/* HEADER PURPLE */}
        <header className="p-4 d-flex justify-content-between align-items-start" 
          style={{ backgroundColor: '#8a70ff', height: '180px', color: 'white' }}>
          <span className="fw-semibold tracking-wide">SMART ATTANDANCE</span>
          <div className="d-flex align-items-center gap-2">
            <img 
              src="https://ui-avatars.com/api/?name=Yona&background=random" 
              alt="User" 
              className="rounded-circle border border-2 border-white"
              width="35"
            />
            <span className="small">yona</span>
          </div>
        </header>

        {/* CONTENT AREA (FLOATING) */}
        <div className="px-4" style={{ marginTop: '-70px' }}>
          
          {/* STATS CARDS */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <StatCard title="KARYAWAN" value="3" sub="Total Terdaftar" />
            </div>
            <div className="col-md-3">
              <StatCard title="JUMLAH ABSEN" value="0" sub="Total Absen Hari ini" />
            </div>
            <div className="col-md-3">
              <StatCard title="PERSENTASE" value="0%" sub="Tingkat Kehadiran" />
            </div>
            <div className="col-md-3">
              <StatCard title="PENGAJUAN" value="1" sub="Menunggu Verifikasi" />
            </div>
          </div>

          {/* MIDDLE SECTION */}
          <div className="row g-4 mb-4">
            {/* Real-time Overview */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4 text-white h-100" style={{ backgroundColor: '#1a2c4e' }}>
                <p className="small text-white fw-bold mb-1">REAL-TIME OVERVIEW</p>
                <h5 className="mb-4">Komposisi Kehadiran Hari Ini</h5>
                
                <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5">
                   {/* Placeholder untuk Chart */}
                   <div className="text-white fst-italic">Area Grafik Kehadiran</div>
                </div>

                <div className="d-flex justify-content-center gap-4 mt-4">
                  <LegendItem color="#38b2ac" label="Hadir" />
                  <LegendItem color="#ed8936" label="Telat" />
                  <LegendItem color="#e53e3e" label="Alpha" />
                </div>
              </div>
            </div>

            {/* Detail Status */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4 text-white h-100" style={{ backgroundColor: '#1a2c4e' }}>
                <p className="small text-white fw-bold mb-4">DETAIL STATUS</p>
                <div className="d-flex flex-column gap-3">
                  <StatusItem color="#38b2ac" label="Hadir Tepat Waktu" value="0" />
                  <StatusItem color="#ed8936" label="Telat" value="0" />
                  <StatusItem color="#e53e3e" label="Alpha / Tidak Hadir" value="0" />
                </div>
              </div>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="card border-0 shadow-sm p-4 text-white mb-5" style={{ backgroundColor: '#1a2c4e' }}>
            <p className="small text-white fw-bold mb-3">ABSENSI KARYAWAN TERBARU</p>
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0" style={{ backgroundColor: '#1a2c4e' }}>
                <thead style={{ backgroundColor: '#233558' }}>
                  <tr className="text-white small">
                    <th className="border-0 p-3">ID KARYAWAN</th>
                    <th className="border-0 p-3">NAMA KARYAWAN</th>
                    <th className="border-0 p-3">TANGGAL</th>
                    <th className="border-0 p-3">JAM MASUK</th>
                    <th className="border-0 p-3">JAM KELUAR</th>
                    <th className="border-0 p-3">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-white border-0">
                      Belum ada data absensi hari ini.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

/* --- MINI COMPONENTS --- */

const StatCard = ({ title, value, sub }) => (
  <div className="card border-0 shadow-sm p-4 text-white h-100" style={{ backgroundColor: '#1a2c4e' }}>
    <p className="small text-white fw-bold mb-2">{title}</p>
    <h2 className="fw-bold mb-1 text-white">{value}</h2>
    <small className="text-white">{sub}</small>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="d-flex align-items-center gap-2 small">
    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }}></div>
    <span>{label}</span>
  </div>
);

const StatusItem = ({ color, label, value }) => (
  <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary">
    <div className="d-flex align-items-center gap-2 small">
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }}></div>
      <span>{label}</span>
    </div>
    <span className="fw-bold">{value}</span>
  </div>
);

export default Home;