import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Karyawan from './pages/Karyawan.jsx'
import TambahKaryawan from './pages/TambahKaryawan.jsx'

function App() {
  return (
    <div className="app">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/karyawan" element={<Karyawan />} />
          <Route path="/tambahkaryawan" element={<TambahKaryawan />} />
        </Routes>
      </main>
    </div>
  )
}

export default App