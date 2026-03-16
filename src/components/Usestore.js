/**
 * Usestore.js — localStorage-backed global state (no Redux/Zustand needed)
 *
 * DATA stored under key "meditation_app" in localStorage:
 * {
 *   user:          { name, joinedAt } | null
 *   history:       [{ id, title, accent, iconName, listenedAt, durationSec, completed }]
 *   favorites:     number[]   (sound IDs)
 *   totalMinutes:  number
 *   streak:        number
 *   lastListenDate:"YYYY-MM-DD" | null
 * }
 */
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'meditation_app';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { /* quota exceeded — ignore */ }
}

function getDefaultState() {
  return {
    user: null,
    history: [],
    favorites: [],
    totalMinutes: 0,
    streak: 0,
    lastListenDate: null,
  };
}

// Module-level singleton so all component instances share one state
let _globalState = { ...(loadFromStorage() || getDefaultState()) };
const _subscribers = new Set();

function setGlobalState(patch) {
  _globalState = { ..._globalState, ...patch };
  saveToStorage(_globalState);
  _subscribers.forEach(fn => fn({ ..._globalState }));
}

export function useStore() {
  const [state, setLocalState] = useState({ ..._globalState });

  useEffect(() => {
    _subscribers.add(setLocalState);
    return () => _subscribers.delete(setLocalState);
  }, []);

  const login = useCallback((name) => {
    setGlobalState({
      user: { name: name.trim(), joinedAt: new Date().toISOString() },
    });
  }, []);

  const logout = useCallback(() => {
    setGlobalState({ user: null });
  }, []);

  const toggleFavorite = useCallback((id) => {
    const current = _globalState.favorites;
    const next = current.includes(id)
      ? current.filter(f => f !== id)
      : [...current, id];
    setGlobalState({ favorites: next });
  }, []);

  const recordListen = useCallback((sound, durationSec) => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const last = _globalState.lastListenDate;

    const streak =
      last === today      ? _globalState.streak :
      last === yesterday  ? _globalState.streak + 1 : 1;

    const entry = {
      id:          sound.id,
      title:       sound.title,
      accent:      sound.accent,
      iconName:    sound.iconName,
      listenedAt:  new Date().toISOString(),
      durationSec: Math.floor(durationSec),
      completed:   durationSec >= sound.duration * 0.8,
    };

    setGlobalState({
      history:        [entry, ..._globalState.history].slice(0, 200),
      totalMinutes:   _globalState.totalMinutes + Math.floor(durationSec / 60),
      streak,
      lastListenDate: today,
    });
  }, []);

  return { ...state, login, logout, toggleFavorite, recordListen };
}