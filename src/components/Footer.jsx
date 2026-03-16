import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">◎ Meditation</span>
          <p className="footer-tagline">Stillness for the modern mind.</p>
        </div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
        <p className="footer-copy">© 2026 Meditation. Made with ♡</p>
      </div>
    </footer>
  );
}