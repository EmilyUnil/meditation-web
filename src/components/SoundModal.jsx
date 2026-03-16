import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { SoundIcon } from './Icons';
import { useStore } from './Usestore';
import './SoundModal.css';

const fmt = (s) => {
  if (!s || isNaN(s) || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
};

function SoundModalContent({ sound, onClose }) {
  const { favorites, toggleFavorite, recordListen, user } = useStore();
  const isFav = favorites.includes(sound.id);

  const audioRef  = useRef(null);
  const startRef  = useRef(null);

  const [playing,     setPlaying]     = useState(false);
  const [volume,      setVolume]      = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(false);

  // Wire audio events
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
    const onMeta  = () => { setDuration(isFinite(a.duration) ? a.duration : sound.duration); setLoading(false); };
    const onTime  = () => setCurrentTime(a.currentTime);
    const onEnd   = () => { setPlaying(false); doRecord(); };
    const onWait  = () => setLoading(true);
    const onCan   = () => setLoading(false);
    const onErr   = () => { setError(true); setLoading(false); };
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnd);
    a.addEventListener('waiting', onWait);
    a.addEventListener('canplay', onCan);
    a.addEventListener('error', onErr);
    return () => {
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnd);
      a.removeEventListener('waiting', onWait);
      a.removeEventListener('canplay', onCan);
      a.removeEventListener('error', onErr);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  // Lock body scroll, handle Escape
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doRecord = useCallback(() => {
    const elapsed = startRef.current ? (Date.now() - startRef.current) / 1000 : 0;
    if (elapsed > 5) recordListen(sound, Math.floor(elapsed));
  }, [sound, recordListen]);

  const handleClose = () => {
    audioRef.current?.pause();
    doRecord();
    onClose();
  };

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      setError(false);
      try {
        setLoading(true);
        await a.play();
        setPlaying(true);
        if (!startRef.current) startRef.current = Date.now();
      } catch {
        setError(true);
        setLoading(false);
      }
    }
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t = ratio * (duration || sound.duration);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const skip = (sec) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(a.currentTime + sec, duration || sound.duration));
  };

  const progress = (duration || sound.duration) > 0 ? (currentTime / (duration || sound.duration)) * 100 : 0;

  const durLabel = sound.duration >= 3600
    ? `${Math.floor(sound.duration / 3600)}h ${Math.floor((sound.duration % 3600) / 60)}m`
    : `${Math.floor(sound.duration / 60)} min`;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        style={{ '--card-accent': sound.accent, '--card-color': sound.color }}
      >
        <audio ref={audioRef} src={sound.audioUrl} preload="metadata" />

        {/* Top bar */}
        <div className="modal-topbar">
          <button className="modal-close" onClick={handleClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <button className={`modal-fav ${isFav ? 'active' : ''}`} onClick={() => toggleFavorite(sound.id)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Icon + title */}
        <div className="modal-hero">
          <div className="modal-icon-wrap">
            <SoundIcon name={sound.iconName} size={54} color={sound.accent} />
            {playing && <div className="modal-icon-rings"><span/><span/></div>}
          </div>
          <h2 className="modal-title">{sound.title}</h2>
          <span className="modal-genre-pill">{sound.genre} · {sound.mood} · {sound.freq}</span>
          <p className="modal-desc">{sound.description}</p>
        </div>

        {error && (
          <div className="modal-error">
            ⚠ Audio unavailable. Check your internet connection.
          </div>
        )}

        {/* Waveform */}
        <div className="modal-progress-wrap">
          <div className="modal-waveform" onClick={seek}>
            {Array.from({ length: 52 }, (_, i) => (
              <div
                key={i}
                className={`wave-bar ${(i / 52) * 100 <= progress ? 'played' : ''}`}
                style={{ height: `${16 + Math.abs(Math.sin(i * 0.48 + sound.id * 1.9) * 48)}%` }}
              />
            ))}
            <div className="waveform-thumb" style={{ left: `${progress}%` }} />
          </div>
          <div className="modal-time-row">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration || sound.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="modal-controls">
          <button className="ctrl-btn ctrl-skip" onClick={() => skip(-15)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
            </svg>
            <span>15</span>
          </button>

          <button className={`ctrl-btn ctrl-play ${loading ? 'loading' : ''}`} onClick={togglePlay} disabled={loading}>
            {loading
              ? <div className="spin-ring"/>
              : playing
                ? <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                : <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
            }
          </button>

          <button className="ctrl-btn ctrl-skip" onClick={() => skip(15)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-.49-3.5"/>
            </svg>
            <span>15</span>
          </button>
        </div>

        {/* Volume */}
        <div className="modal-volume-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>}
            {volume > 0.4 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>}
          </svg>
          <input
            type="range" min="0" max="1" step="0.02" value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="vol-slider" style={{ '--vol': `${volume * 100}%` }}
          />
          <span className="vol-label">{Math.round(volume * 100)}%</span>
        </div>

        {/* Stats */}
        <div className="modal-stats">
          {[
            { label: 'Listeners', value: sound.listeners },
            { label: 'Frequency', value: sound.freq },
            { label: 'Duration',  value: durLabel },
          ].map(s => (
            <div key={s.label} className="modal-stat">
              <span className="modal-stat-label">{s.label}</span>
              <span className="modal-stat-val">{s.value}</span>
            </div>
          ))}
        </div>

        {!user && (
          <p className="modal-auth-hint">Sign in to track your listening history and favorites.</p>
        )}
      </div>
    </div>
  );
}

// Render via Portal so it's never clipped by parent overflow
export default function SoundModal({ sound, onClose }) {
  return ReactDOM.createPortal(
    <SoundModalContent sound={sound} onClose={onClose} />,
    document.body
  );
}