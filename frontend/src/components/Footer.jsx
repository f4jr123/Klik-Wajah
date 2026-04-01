import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">👤</span>
          <span className="footer-title">Klik<span className="text-gradient">Wajah</span></span>
        </div>
        <p className="footer-text">
          Sistem Absensi Pengenalan Wajah &copy; {new Date().getFullYear()}
        </p>
        <div className="footer-credits">
          <span>Dibuat oleh Tim Kelompok</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
