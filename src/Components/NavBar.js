import React from "react";
import './NavBar.css'; 
import Logo from './AppLogo.png'

const NavBar = () => {
  return (
    <nav className="NavBar">
      <div className="NavBar-logo">
        <img src="{Logo}" alt="Team Logo" />
      </div>
      <h1>Good Numbers Accounting</h1> 
    </nav>
  );
}


export default NavBar;
