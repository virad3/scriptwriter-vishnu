import React from "react";
import logo from "../assets/logo.png";

const Logo: React.FC = () => {
  return (
    <img
      src={logo}
      alt="App Logo"
      width={80}
      height={80}
      style={{ objectFit: "contain" }}
    />
  );
};

export default Logo;
