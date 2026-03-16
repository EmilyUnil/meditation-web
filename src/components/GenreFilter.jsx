import React, { useState } from 'react';
import { sounds, genres } from '../data/sounds';
import { SoundIcon } from './Icons';
import SoundModal from './SoundModal';
import './GenreFilter.css';

function MiniCard({ sound, onOpen }) {
  return (
    <div
      className="mini-card"
      style={{ '--card-accent': sound.accent, '--card-color': sound.color }}
      onClick={onOpen}
    >
      <div className="mini-card-left">
        <div className="mini-blob">
          <SoundIcon name={sound.iconName} size={22} color={sound.accent} />
        </div>
        <div className="mini-info">
          <h4 className="mini-title">{sound.title}</h4>
          <span className="mini-meta">{sound.freq} · {sound.duration} · {sound.mood}</span>
        </div>
      </div>
      <div className="mini-card-right">
        <span className="mini-listeners">{sound.listeners} listening</span>
        <button className="mini-open" aria-label="Open player">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="5,3 19,12 5,21"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function GenreFilter({ activeGenre, setActiveGenre }) {
  const [modalSound, setModalSound] = useState(null);

  const filtered = activeGenre === 'all'
    ? sounds
    : sounds.filter(s => s.genre === activeGenre);

  return (
    <>
      <section className="genre-section" id="genres">
        <div className="genre-header">
          <h2 className="genre-title">Browse by genre</h2>
          <p className="genre-sub">Filter sounds by type and mood — click any track to open the player</p>
        </div>

        <div className="genre-pills">
          {genres.map(g => (
            <button
              key={g.id}
              className={`genre-pill ${activeGenre === g.id ? 'active' : ''}`}
              onClick={() => setActiveGenre(g.id)}
            >
              <span className="pill-icon">
                <SoundIcon name={g.iconName} size={15} color={activeGenre === g.id ? 'currentColor' : 'currentColor'} />
              </span>
              {g.label}
            </button>
          ))}
        </div>

        <p className="genre-count">
          {filtered.length} sound{filtered.length !== 1 ? 's' : ''} available
        </p>

        <div className="mini-grid">
          {filtered.map(sound => (
            <MiniCard
              key={sound.id}
              sound={sound}
              onOpen={() => setModalSound(sound)}
            />
          ))}
        </div>
      </section>

      {modalSound && (
        <SoundModal sound={modalSound} onClose={() => setModalSound(null)} />
      )}
    </>
  );
}