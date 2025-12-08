import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="logoGradient" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo-600 */}
        <stop offset="50%" stopColor="#7C3AED" /> {/* Violet-600 */}
        <stop offset="100%" stopColor="#DB2777" /> {/* Pink-600 */}
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
         <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* Main Container - Rounded Square with Gradient */}
    <rect x="10" y="10" width="100" height="100" rx="24" fill="url(#logoGradient)" filter="url(#softShadow)" />

    {/* Center Element - Pen Nib + Script Page Fusion */}
    <g transform="translate(60, 60) scale(1.1) translate(-60, -60)">
        {/* The body of the pen nib */}
        <path 
            d="M40 30 H80 L 75 60 C 75 60 70 95 60 100 C 50 95 45 60 45 60 L 40 30 Z" 
            fill="white" 
            fillOpacity="0.95"
        />
        
        {/* The 'slit' of the nib, represented as a digital cursor or negative space */}
        <path d="M60 65 V 85" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />
        
        {/* Horizontal lines on the upper part of the nib to resemble a page */}
        <path d="M48 40 H 72" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.8" />
        <path d="M50 50 H 70" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.6" />
        
        {/* A sparkle/star at the tip to represent AI/Creativity */}
        <path 
            d="M60 15 L 63 22 L 70 25 L 63 28 L 60 35 L 57 28 L 50 25 L 57 22 Z" 
            fill="white"
        >
             <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
             <animateTransform attributeName="transform" type="rotate" from="0 60 25" to="360 60 25" dur="10s" repeatCount="indefinite" />
        </path>
    </g>
  </svg>
);

export default Logo;