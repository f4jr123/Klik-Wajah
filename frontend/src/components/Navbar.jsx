import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { path: '/', label: 'Beranda', icon: '🏠' },
    { path: '/tambah-karyawan', label: 'Tambah Karyawan', icon: '➕' },
    { path: '/daftar-karyawan', label: 'Daftar Karyawan', icon: '👥' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">👤</span>
          <span className="brand-text">Klik<span className="brand-accent">Wajah</span></span>
        </Link>

        <button
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="navbar-toggle-btn"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
                id={`nav-link-${link.path.replace('/', '') || 'home'}`}
              >
                <span className="link-icon">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
