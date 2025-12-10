import React from 'react';

// --- CONFIGURATION ---
// To use a custom logo image for the entire app, paste your URL between the quotes below.
// Example: "https://mysite.com/logo.png"
const CUSTOM_LOGO_URL = ""; 

interface LogoProps {
  className?: string;
  imageUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", imageUrl }) => {
  // Priority: 1. Prop passed directly, 2. Global constant, 3. Default SVG
  const activeImage = imageUrl || CUSTOM_LOGO_URL;

  if (activeImage) {
    return (
      <img 
        src={activeImage} 
        alt="App Logo" 
        className={`${className} object-contain`} 
      />
    );
  }

  // Default Golden Nib SVG Logo
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="goldGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" /> {/* Amber 200 */}
          <stop offset="40%" stopColor="#D97706" /> {/* Amber 600 */}
          <stop offset="100%" stopColor="#78350F" /> {/* Amber 900 */}
        </linearGradient>
        <linearGradient id="magicGradient" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      
      {/* Geometric Particles (Background Layer) */}
      <circle cx="25" cy="35" r="1.5" fill="#60A5FA" opacity="0.6" />
      <rect x="75" y="25" width="3" height="3" fill="#FCD34D" transform="rotate(45 75 25)" opacity="0.6" />

      {/* The Flow / Swirls (Magic Ink) */}
      <g opacity="0.9">
          <path 
          d="M50 55 C 50 40, 30 35, 35 15" 
          stroke="url(#magicGradient)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          fill="none" 
          />
          <path 
          d="M50 55 C 50 35, 60 30, 55 10" 
          stroke="url(#magicGradient)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          fill="none" 
          />
          <path 
          d="M50 55 C 60 40, 75 35, 70 15" 
          stroke="url(#magicGradient)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          fill="none" 
          />
          {/* Fine detail lines */}
          <path d="M45 55 C 45 45 35 40 38 25" stroke="#60A5FA" strokeWidth="0.5" opacity="0.5" />
          <path d="M55 55 C 55 45 65 40 62 25" stroke="#A78BFA" strokeWidth="0.5" opacity="0.5" />
      </g>

      {/* The Nib */}
      <g filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.4))">
        {/* Upper Collar / Grip Section */}
        <path 
          d="M38 52 C 38 49, 62 49, 62 52 V 55 C 62 57, 38 57, 38 55 Z" 
          fill="#92400E" 
        />
        <path 
          d="M40 55 H60 L60 58 C 60 59, 40 59, 40 58 Z" 
          fill="#B45309" 
        />
        
        {/* Nib Body */}
        <path 
          d="M40 58 
            H60 
            L58 78 
            C 58 88, 52 95, 50 98 
            C 48 95, 42 88, 42 78 
            L40 58 Z" 
          fill="url(#goldGradient)" 
        />
        
        {/* Detail: Slit and Hole (Breather hole) */}
        <circle cx="50" cy="72" r="2.5" fill="#1e1e1e" />
        <path d="M50 74 V 94" stroke="#1e1e1e" strokeWidth="1" />
        
        {/* Metallic Shine / Highlight */}
        <path 
          d="M56 62 C 56 62, 57 72, 53 85" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeOpacity="0.5" 
          strokeLinecap="round" 
        />
      </g>

      {/* Geometric Particles (Foreground Layer) */}
      <circle cx="38" cy="22" r="2" fill="#FCD34D" />
      <rect x="62" y="32" width="4" height="4" fill="#60A5FA" transform="rotate(30 62 32)" />
      <circle cx="50" cy="5" r="1.5" fill="#A78BFA" />
      <rect x="45" y="12" width="2" height="2" fill="white" transform="rotate(15 45 12)" opacity="0.8" />
    </svg>
  );
};

export default Logo;