import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Sistem Absensi Modern
          </div>

          <h1 className="hero-title">
            Absensi Lebih Cepat
            <br />
            dengan <span className="text-gradient">Pengenalan Wajah</span>
          </h1>

          <p className="hero-description">
            Klik-Wajah adalah sistem absensi berbasis face recognition yang memudahkan
            proses pencatatan kehadiran karyawan secara otomatis, akurat, dan efisien.
          </p>

          <div className="hero-actions">
            <Link to="/tambah-karyawan" className="btn btn-primary" id="hero-btn-tambah">
              <span>➕</span> Tambah Karyawan
            </Link>
            <Link to="/daftar-karyawan" className="btn btn-secondary" id="hero-btn-daftar">
              <span>👥</span> Lihat Daftar
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="face-scan-demo">
            <div className="scan-frame">
              <div className="scan-corner scan-corner-tl"></div>
              <div className="scan-corner scan-corner-tr"></div>
              <div className="scan-corner scan-corner-bl"></div>
              <div className="scan-corner scan-corner-br"></div>
              <div className="scan-line"></div>
              <div className="face-icon">👤</div>
            </div>
            <p className="scan-label">Face Recognition Active</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="features-title">Fitur <span className="text-gradient">Unggulan</span></h2>

        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon">🎯</div>
            <h3>Akurasi Tinggi</h3>
            <p>Pengenalan wajah dengan teknologi AI yang akurat untuk identifikasi karyawan.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon">⚡</div>
            <h3>Proses Cepat</h3>
            <p>Absensi instan hanya dengan satu klik — tidak perlu kartu atau fingerprint.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon">🔒</div>
            <h3>Data Aman</h3>
            <p>Data wajah karyawan disimpan secara terenkripsi dan aman di database server.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon">📊</div>
            <h3>Manajemen Divisi</h3>
            <p>Kelola data karyawan berdasarkan divisi dengan mudah dan terstruktur.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
