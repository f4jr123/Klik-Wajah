import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  LayoutDashboard, FileText, ListOrdered, Building2, 
  Users, PieChart, Settings, ChevronLeft, ChevronRight, Plus, Search 
} from 'lucide-react';

const KaryawanPage = () => {
  // Data dummy sesuai di gambar
  const [employees] = useState([
    { id: "909584", nama: "yonac35", divisi: "000-18", status: "Terdaftar" },
    { id: "1234", nama: "Yona", divisi: "000-10", status: "Terdaftar" }
  ]);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* --- SIDEBAR --- */}
      <aside className="bg-white border-end d-none d-md-block" style={{ width: '260px' }}>
        <div className="p-4">
          <h3 className="fs-4 fw-bold mb-5" style={{ color: '#4a4e69' }}>Absensi</h3>
          <nav className="nav flex-column gap-1">
            <SidebarLink icon={<LayoutDashboard size={18}/>} label="Dashboard" />
            <SidebarLink icon={<FileText size={18}/>} label="Pengajuan Absen" />
            <SidebarLink icon={<ListOrdered size={18}/>} label="Absensi" />
            <SidebarLink icon={<Building2 size={18}/>} label="Divisi" />
            <SidebarLink icon={<Users size={18}/>} label="Karyawan" active />
            <SidebarLink icon={<PieChart size={18}/>} label="Laporan Bulanan" />
            <SidebarLink icon={<Settings size={18}/>} label="Managemen Users" />
          </nav>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-grow-1">
        
        {/* Header Background Ungu */}
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

        {/* Floating Card Tabel */}
        <div className="container-fluid px-4" style={{ marginTop: '-80px' }}>
          <div className="card border-0 shadow-lg rounded-3 overflow-hidden" 
               style={{ backgroundColor: '#1a2235', color: '#e2e8f0' }}>
            
            <div className="card-body p-4">
              {/* Card Title & Add Button */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0 fw-bold">Data Karyawan</h5>
                <button className="btn btn-primary px-4 d-flex align-items-center gap-2" 
                        style={{ backgroundColor: '#5c54e5', border: 'none' }}>
                  <Plus size={18}/> Add
                </button>
              </div>

              {/* Toolbar: Show Entries & Search */}
              <div className="row mb-4 align-items-center">
                <div className="col-md-6 mb-2 mb-md-0 d-flex align-items-center gap-2 small">
                  Tampilkan 
                  <select className="form-select form-select-sm border-secondary text-white w-auto" 
                          style={{ backgroundColor: '#2d3748' }}>
                    <option>10</option>
                  </select> 
                  data
                </div>
                <div className="col-md-6 d-flex justify-content-md-end align-items-center gap-2 small">
                  Cari: 
                  <input type="text" className="form-control form-control-sm border-secondary text-white w-auto shadow-none" 
                         style={{ backgroundColor: '#454d5e' }} />
                </div>
              </div>

              {/* Table Body */}
              <div className="table-responsive">
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
                        <td className="bg-transparent fw-medium">{emp.id}</td>
                        <td className="bg-transparent">{emp.nama}</td>
                        <td className="bg-transparent">{emp.divisi}</td>
                        <td className="bg-transparent">
                          <div className="d-flex flex-column gap-2">
                            <div className="small d-flex align-items-center gap-2">
                              <span className="p-1 bg-success rounded-circle shadow-sm"></span> 
                              {emp.status}
                            </div>
                            <div className="d-flex gap-1">
                              <button className="btn btn-primary btn-sm py-0 px-2" style={{ fontSize: '10px' }}>Reg. Ulang</button>
                              <button className="btn btn-danger btn-sm py-0 px-2" style={{ fontSize: '10px' }}>Hapus Wajah</button>
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
              </div>

              {/* Pagination Footer */}
              <div className="d-flex justify-content-between align-items-center mt-4 small text-secondary">
                <span>Menampilkan 1 s/d {employees.length} dari {employees.length} data</span>
                <nav>
                  <ul className="pagination pagination-sm mb-0 gap-1">
                    <li className="page-item">
                      <button className="page-link bg-secondary border-0 text-white rounded-circle"><ChevronLeft size={14}/></button>
                    </li>
                    <li className="page-item">
                      <button className="page-link border-0 text-white rounded-circle active" 
                              style={{ backgroundColor: '#5c54e5' }}>1</button>
                    </li>
                    <li className="page-item">
                      <button className="page-link bg-secondary border-0 text-white rounded-circle"><ChevronRight size={14}/></button>
                    </li>
                  </ul>
                </nav>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-komponen SidebarLink untuk efisiensi kode
const SidebarLink = ({ icon, label, active = false }) => (
  <div 
    className={`d-flex align-items-center gap-3 p-3 rounded-2 cursor-pointer transition-all ${
      active ? 'text-primary fw-bold' : 'text-secondary hover-bg-light'
    }`}
    style={{ cursor: 'pointer', fontSize: '0.9rem' }}
  >
    {icon}
    <span>{label}</span>
  </div>
);

export default KaryawanPage;