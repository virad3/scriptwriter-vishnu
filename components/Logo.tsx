import React from "react";

// Update the path below to match where your PNG image is stored
import logo from "./logo.png"; // example path

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 120, height = "auto", className }) => {
  return (
    <img
      src={logo}
      alt="Application Logo"
      width={width}
      height={height}
      className={className}
    />
  );
};

export default Logo;
