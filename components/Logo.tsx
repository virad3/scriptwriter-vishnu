import React, { useState } from 'react';

// ==============================================================================
// HOW TO USE THIS LOGO:
// 1. Save your image as "logo.png" inside this same 'components' folder.
// 2. The app loads it with the path below.
// ==============================================================================

const LOCAL_LOGO_PATH = "./logo.png";

interface LogoProps {
  className?: string;
  imageUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = "w-20 h-20",   // 80x80 default size
  imageUrl
}) => {
  const [imageError, setImageError] = useState(false);

  // Priority: explicit prop → local logo file
  const activeImage = imageUrl || LOCAL_LOGO_PATH;

  // Attempt to load the real image
  if (activeImage && !imageError) {
    return (
      <img
        src={activeImage}
        alt="App Logo"
        className={`${className} object-contain`}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback SVG if image fails
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Simple fallback indicator */}
      <circle cx="50" cy="50" r="40" fill="#ddd" />
      <text x="50" y="55" textAnchor="middle" fill="#555" fontSize="10">
        Logo
      </text>
    </svg>
  );
};

export default Logo;
