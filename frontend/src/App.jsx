import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import TambahKaryawan from './pages/TambahKaryawan.jsx'
import DaftarKaryawan from './pages/DaftarKaryawan.jsx'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tambah-karyawan" element={<TambahKaryawan />} />
          <Route path="/daftar-karyawan" element={<DaftarKaryawan />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
