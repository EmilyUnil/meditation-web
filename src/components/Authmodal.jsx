import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useStore } from './Usestore';
import './AuthModal.css';

function AuthModalContent({ onClose }) {
  const { login } = useStore();
  const [name, setName] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    login(trimmed);
    onClose();
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="auth-icon">◎</div>
        <h2 className="auth-title">Welcome to Meditation</h2>
        <p className="auth-sub">
          Enter your name to start tracking sessions, streaks and favorites.
          All data stays privately in your browser — no servers, no accounts.
        </p>

        <form onSubmit={submit} className="auth-form">
          <input
            className="auth-input"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            maxLength={40}
          />
          <button type="submit" className="auth-btn" disabled={!name.trim()}>
            Start meditating
          </button>
        </form>

        <p className="auth-note">No password required. Pure localStorage.</p>
      </div>
    </div>
  );
}

export default function AuthModal({ onClose }) {
  return ReactDOM.createPortal(
    <AuthModalContent onClose={onClose} />,
    document.body
  );
}