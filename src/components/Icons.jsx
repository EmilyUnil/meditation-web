import React from 'react';

const icons = {
  forest: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6 L10 28 H20 L14 42 H34 L28 28 H38 Z" fill={color} opacity="0.9"/>
      <path d="M24 4 L11 26 H21 L15 40 H33 L27 26 H37 Z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  ocean: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20 Q12 14 20 20 Q28 26 36 20 Q42 15 44 20" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M4 28 Q12 22 20 28 Q28 34 36 28 Q42 23 44 28" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M4 36 Q12 30 20 36 Q28 42 36 36 Q42 31 44 36" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4"/>
    </svg>
  ),
  bowl: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="24" rx="18" ry="8" stroke={color} strokeWidth="2" fill="none"/>
      <ellipse cx="24" cy="22" rx="18" ry="8" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.15"/>
      <line x1="6" y1="22" x2="6" y2="24" stroke={color} strokeWidth="2"/>
      <line x1="42" y1="22" x2="42" y2="24" stroke={color} strokeWidth="2"/>
      <line x1="38" y1="14" x2="44" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="30" rx="3" r="3" fill={color} fillOpacity="0.3"/>
    </svg>
  ),
  rain: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 22 Q10 10 24 10 Q38 10 38 22 Q44 22 44 28 Q44 34 38 34 H10 Q4 34 4 28 Q4 22 10 22 Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
      <line x1="16" y1="38" x2="14" y2="46" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="38" x2="22" y2="46" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="38" x2="30" y2="46" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  wind: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 18 Q16 18 20 14 Q24 10 28 14 Q32 18 28 22 Q24 26 16 22 H4" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M4 28 Q14 28 18 32 Q22 36 18 38 Q14 40 12 38" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M8 23 H40" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  waves: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="4" fill={color}/>
      <circle cx="24" cy="24" r="10" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7"/>
      <circle cx="24" cy="24" r="17" stroke={color} strokeWidth="1.5" fill="none" opacity="0.4"/>
      <line x1="24" y1="4" x2="24" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="24" y1="38" x2="24" y2="44" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="4" y1="24" x2="10" y2="24" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="38" y1="24" x2="44" y2="24" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  bamboo: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="19" y="4" width="5" height="40" rx="2.5" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
      <line x1="19" y1="16" x2="24" y2="16" stroke={color} strokeWidth="2"/>
      <line x1="19" y1="28" x2="24" y2="28" stroke={color} strokeWidth="2"/>
      <path d="M24 12 Q32 10 34 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M24 24 Q32 22 36 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  space: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="6" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
      <circle cx="10" cy="12" r="1.5" fill={color}/>
      <circle cx="38" cy="10" r="1" fill={color} opacity="0.7"/>
      <circle cx="8" cy="34" r="1" fill={color} opacity="0.5"/>
      <circle cx="40" cy="36" r="1.5" fill={color} opacity="0.8"/>
      <circle cx="18" cy="8" r="1" fill={color} opacity="0.6"/>
      <circle cx="36" cy="38" r="1" fill={color} opacity="0.4"/>
      <ellipse cx="24" cy="24" rx="14" ry="5" stroke={color} strokeWidth="1" fill="none" opacity="0.4"/>
    </svg>
  ),
  fire: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6 C24 6 30 14 28 20 C26 26 22 24 22 28 C22 32 26 34 24 38 C18 36 12 30 14 22 C10 26 10 30 12 34 C8 30 8 22 12 16 C14 26 18 24 20 20 C20 16 18 12 24 6 Z" fill={color} fillOpacity="0.85" stroke={color} strokeWidth="1" strokeLinejoin="round"/>
      <path d="M24 26 C24 26 27 29 24 34 C21 31 21 27 24 26 Z" fill="white" fillOpacity="0.3"/>
    </svg>
  ),
};

export function SoundIcon({ name, size = 32, color = 'currentColor' }) {
  const Icon = icons[name];
  if (!Icon) return <span style={{ fontSize: size * 0.8, lineHeight: 1 }}>◎</span>;
  return <Icon size={size} color={color} />;
}