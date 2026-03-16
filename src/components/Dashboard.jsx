import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useStore } from './Usestore';
import { SoundIcon } from './Icons';
import './Dashboard.css';

const fmtMin = (min) => {
  if (!min) return '0m';
  if (min < 60) return `${min}m`;
  return `${Math.floor(min / 60)}h ${min % 60}m`;
};

const relDate = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
};

function DashboardContent({ onClose }) {
  const { user, history, favorites, totalMinutes, streak, logout } = useStore();
  const [tab, setTab] = useState('history');

  const handleLogout = () => { logout(); onClose(); };

  // Last 7 days bar chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const sessions = history.filter(h => h.listenedAt.slice(0, 10) === d);
    const mins = sessions.reduce((acc, h) => acc + Math.floor(h.durationSec / 60), 0);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return { date: d, mins, label: dayNames[new Date(d + 'T12:00:00').getDay()] };
  }).reverse();

  const maxMins = Math.max(...last7.map(d => d.mins), 1);

  const joinedDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en', { month: 'short', year: 'numeric' })
    : '';

  return (
    <div className="dash-overlay" onClick={onClose}>
      <div className="dash" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="dash-header">
          <div className="dash-user">
            <div className="dash-avatar">{user?.name?.[0]?.toUpperCase() ?? '?'}</div>
            <div>
              <div className="dash-name">{user?.name}</div>
              <div className="dash-since">Member since {joinedDate}</div>
            </div>
          </div>
          <div className="dash-header-actions">
            <button className="dash-btn-sm" onClick={handleLogout}>Sign out</button>
            <button className="dash-close" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          <div className="dash-stat">
            <span className="dash-stat-val">{fmtMin(totalMinutes)}</span>
            <span className="dash-stat-label">Total listened</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat-val">{streak} 🔥</span>
            <span className="dash-stat-label">Day streak</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat-val">{history.length}</span>
            <span className="dash-stat-label">Sessions</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat-val">{favorites.length}</span>
            <span className="dash-stat-label">Favorites</span>
          </div>
        </div>

        {/* 7-day chart */}
        <div className="dash-chart-wrap">
          <p className="dash-chart-title">Last 7 days (minutes)</p>
          <div className="dash-chart">
            {last7.map(d => (
              <div key={d.date} className="dash-bar-col">
                <div className="dash-bar-wrap">
                  <div
                    className="dash-bar"
                    title={`${d.mins} min`}
                    style={{
                      height: d.mins ? `${Math.max(6, (d.mins / maxMins) * 100)}%` : '4%',
                      opacity: d.mins ? 1 : 0.2
                    }}
                  />
                </div>
                <span className="dash-bar-label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="dash-tabs">
          <button className={`dash-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
            History
          </button>
          <button className={`dash-tab ${tab === 'favorites' ? 'active' : ''}`} onClick={() => setTab('favorites')}>
            Favorites ({favorites.length})
          </button>
        </div>

        {/* List */}
        <div className="dash-list">
          {tab === 'history' && (
            history.length === 0
              ? <p className="dash-empty">No sessions yet. Start listening! 🎵</p>
              : history.slice(0, 20).map((h, i) => (
                <div key={i} className="dash-item">
                  <div className="dash-item-icon">
                    <SoundIcon name={h.iconName} size={18} color={h.accent} />
                  </div>
                  <div className="dash-item-info">
                    <span className="dash-item-title">{h.title}</span>
                    <span className="dash-item-meta">
                      {fmtMin(Math.floor(h.durationSec / 60))} · {relDate(h.listenedAt)}
                    </span>
                  </div>
                  {h.completed && <span className="dash-item-badge">Done ✓</span>}
                </div>
              ))
          )}
          {tab === 'favorites' && (
            favorites.length === 0
              ? <p className="dash-empty">Heart a sound while playing to save it here. ♥</p>
              : <p className="dash-empty" style={{ color: 'var(--text-secondary)', textAlign: 'left', padding: '16px 24px' }}>
                  {favorites.length} sound{favorites.length !== 1 ? 's' : ''} saved. Open any sound and tap the heart icon to manage.
                </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default function Dashboard({ onClose }) {
  return ReactDOM.createPortal(
    <DashboardContent onClose={onClose} />,
    document.body
  );
}