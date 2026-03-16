import React from 'react';
import { SoundIcon } from './Icons';
import './SoundCard.css';

export default function SoundCard({ sound, isActive, onClick }) {
  return (
    <div
      className={`sound-card ${isActive ? 'sound-card--active' : ''}`}
      style={{ '--card-color': sound.color, '--card-accent': sound.accent }}
      onClick={onClick}
    >
      <div className="card-blob">
        <SoundIcon name={sound.iconName} size={36} color={sound.accent} />
        {isActive && <div className="card-waves"><span/><span/><span/></div>}
      </div>

      <div className="card-mood">{sound.mood}</div>
      <h3 className="card-title">{sound.title}</h3>
      <p className="card-desc">{sound.description}</p>

      <div className="card-meta">
        <span className="card-meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {sound.duration >= 3600
            ? `${Math.floor(sound.duration / 3600)}h ${Math.floor((sound.duration % 3600) / 60)}m`
            : `${Math.floor(sound.duration / 60)} min`}
        </span>
        <span className="card-meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
          {sound.freq}
        </span>
        <span className="card-meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          {sound.listeners}
        </span>
      </div>

      {/* Styled button — always visible on active card */}
      <button className={`card-open-btn ${isActive ? 'visible' : ''}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,3 19,12 5,21"/>
        </svg>
        Open player
      </button>
    </div>
  );
}