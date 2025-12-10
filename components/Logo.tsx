import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  // Using a direct relative path from index.html to the image
  return (
    <img 
      src="components/logo.png" 
      alt="Writer Room Logo" 
      className={`${className} object-contain`}
      onError={(e) => console.warn("Logo failed to load from components/logo.png")}
    />
  );
};

export default Logo;