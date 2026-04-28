import { Routes, Route } from 'react-router-dom'
// Hapus atau comment baris import ini:
// import Navbar from './components/Navbar.jsx' 

import Home from './pages/Home.jsx'
import TambahKaryawan from './pages/TambahKaryawan.jsx'

function App() {
  return (
    <div className="app">
      {/* HAPUS baris <Navbar /> di bawah ini */}
      {/* <Navbar /> */}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tambah-karyawan" element={<TambahKaryawan />} />
        </Routes>
      </main>
    </div>
  )
}

export default App