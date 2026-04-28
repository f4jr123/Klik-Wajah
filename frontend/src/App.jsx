import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Karyawan from './pages/Karyawan.jsx'
import TambahKaryawan from './pages/TambahKaryawan.jsx'
import Absensi from './pages/absensi.jsx'
import PengajuanAbsen from './pages/pengajuan-absen.jsx'
import DataAbsensiKaryawan from './pages/DataAbsensiKaryawan.jsx'
import DataDivisi from './pages/DataDivisi.jsx'

function App() {
  return (
    <div className="app">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Absensi />} />
          <Route path="/home" element={<Home />} />
          <Route path="/karyawan" element={<Karyawan />} />
          <Route path="/tambahkaryawan" element={<TambahKaryawan />} />
          <Route path="/pengajuan-absen" element={<PengajuanAbsen />} />
          <Route path="/absensi" element={<DataAbsensiKaryawan />} />
          <Route path="/divisi" element={<DataDivisi />} />
        </Routes>
      </main>
    </div>
  )
}

export default App