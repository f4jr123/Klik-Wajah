import { Routes, Route } from 'react-router-dom'
// Hapus atau comment baris import ini:
// import Navbar from './components/Navbar.jsx' 

import Home from './pages/Home.jsx'
import TambahKaryawan from './pages/TambahKaryawan.jsx'
import DaftarKaryawan from './pages/DaftarKaryawan.jsx'
import './App.css'

function App() {
  return (
    <div className="app">
      {/* HAPUS baris <Navbar /> di bawah ini */}
      {/* <Navbar /> */}
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tambah-karyawan" element={<TambahKaryawan />} />
          <Route path="/daftar-karyawan" element={<DaftarKaryawan />} />
        </Routes>
      </main>
    </div>
  )
}

export default App