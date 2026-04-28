import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  List, 
  Building2, 
  Users, 
  PieChart, 
  Settings 
} from 'lucide-react';

const Sidebar = ({ activePage = 'Dashboard' }) => {
  const menus = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
    { name: 'Pengajuan Absen', icon: <FileText size={18} />, path: '/pengajuan-absen' },
    { name: 'Absensi', icon: <List size={18} />, path: '/absensi' },
    { name: 'Divisi', icon: <Building2 size={18} />, path: '/divisi' },
    { name: 'Karyawan', icon: <Users size={18} />, path: '/karyawan' },
    { name: 'Laporan Bulanan', icon: <PieChart size={18} />, path: '/laporan' },
    { name: 'Managemen Users', icon: <Settings size={18} />, path: '/users' },
  ];

  const handleClick = (e, path) => {
    e.preventDefault();
    // Navigate using window.location for simple routing
    window.location.href = path;
  };

  return (
    <aside className="bg-white border-end d-none d-md-block" style={{ width: '260px' }}>
      <div className="p-4">
        <h3 className="fw-bold mb-5" style={{ color: '#1a2c4e' }}>Absensi</h3>
        <nav className="nav flex-column gap-2">
          {menus.map((menu, index) => (
            <a
              key={index}
              href={menu.path}
              onClick={(e) => handleClick(e, menu.path)}
              className={`nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${
                activePage === menu.name 
                  ? 'bg-light text-primary fw-bold' 
                  : 'text-secondary'
              }`}
            >
              {menu.icon}
              <span>{menu.name}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;