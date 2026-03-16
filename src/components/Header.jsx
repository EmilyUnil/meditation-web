import React from 'react';
import './Header.css';

export default function Header({ darkMode, toggleDark, onProfile, user }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <span className="logo-icon">◎</span>
          <span className="logo-text">Meditation</span>
        </div>

        <nav className="header-nav">
          <a href="#sounds">Sounds</a>
          <a href="#genres">Genres</a>
        </nav>

        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleDark} aria-label="Toggle theme">
            <span className="toggle-track">
              <span className="toggle-thumb">{darkMode ? '☽' : '☀'}</span>
            </span>
          </button>

          {/* "Begin session" always opens profile/auth */}
          <button className="btn-begin" onClick={onProfile}>
            {user ? (
              <>
                <span className="profile-avatar">{user.name[0].toUpperCase()}</span>
                <span className="btn-begin-text">{user.name}</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="btn-begin-text">Begin session</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}