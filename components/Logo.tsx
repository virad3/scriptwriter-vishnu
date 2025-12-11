import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg
      viewBox="0 0 200 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradient for the Gold Nib */}
        <linearGradient id="nibGold" x1="100" y1="0" x2="100" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FCD34D" /> {/* bright yellow-gold */}
          <stop offset="40%" stopColor="#D97706" /> {/* amber-600 */}
          <stop offset="100%" stopColor="#92400E" /> {/* amber-800 */}
        </linearGradient>
      </defs>

      {/* --- 1. The Nib (Chimney) --- */}
      <g transform="translate(100, 10)">
        {/* Nib Tip/Body */}
        <path
          d="M0 0 
             C 10 20, 35 60, 35 90 
             C 35 110, 25 125, 20 130 
             L -20 130 
             C -25 125, -35 110, -35 90 
             C -35 60, -10 20, 0 0 Z"
          fill="url(#nibGold)"
        />
        {/* Slit */}
        <path d="M0 35 L0 90" stroke="#78350F" strokeWidth="2" opacity="0.5" />
        <circle cx="0" cy="90" r="5" fill="#FFFBEB" opacity="0.9" />
        
        {/* Base Rings (Collar) */}
        <path d="M-22 130 Q0 138 22 130 L22 138 Q0 146 -22 138 Z" fill="url(#nibGold)" />
        <path d="M-20 140 Q0 148 20 140 L21 155 Q0 163 -21 155 Z" fill="url(#nibGold)" />
      </g>

      {/* --- 2. House / Book Structure --- */}
      {/* Using lighter slate (#cbd5e1) for visibility on dark background */}
      <g stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        
        {/* Roof (Open Book Pages) */}
        <path d="M60 160 L100 130 L140 160" /> {/* Top Outline */}
        <path d="M64 168 L100 142 L136 168" /> {/* Page 2 */}
        <path d="M68 176 L100 154 L132 176" /> {/* Page 3 */}

        {/* Left Wall (Book Spines) */}
        {/* Top Spine */}
        <path d="M50 180 H90" />
        <path d="M50 180 Q45 188 50 196 H90" fill="none"/>
        {/* Bottom Spine */}
        <path d="M50 200 H90" />
        <path d="M50 200 Q45 208 50 216 H90" fill="none"/>
        <path d="M90 180 V216" />

        {/* Right Wall */}
        <path d="M140 160 V216" />
        <path d="M110 216 H140" />
        
        {/* Foundation Line */}
        <path d="M90 216 H110" />

      </g>

      {/* --- 3. Circuit Traces (Left) --- */}
      <g stroke="#F59E0B" strokeWidth="2" fill="none">
         <path d="M45 188 L30 188 L20 180" />
         <circle cx="20" cy="180" r="3" fill="#F59E0B" stroke="none"/>
         
         <path d="M45 208 L30 208 L20 216" />
         <circle cx="20" cy="216" r="3" fill="#F59E0B" stroke="none"/>
      </g>

      {/* --- 4. Film Icon (Inside Right) --- */}
      <g transform="translate(112, 185)" stroke="#cbd5e1" strokeWidth="2">
         {/* Reels */}
         <circle cx="6" cy="0" r="4" />
         <circle cx="16" cy="0" r="4" />
         {/* Body */}
         <rect x="2" y="4" width="18" height="12" rx="2" fill="none" />
         {/* Lens Triangle */}
         <path d="M20 8 L24 6 V14 L20 12" fill="#cbd5e1" stroke="none" />
      </g>
    </svg>
  );
};

export default Logo;