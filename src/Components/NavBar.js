import React from "react";
import './NavBar.css'; 
import Logo from './AppLogo.png'

const NavBar = () => {
  return (
    <nav className="NavBar">
      <div className="NavBar-logo">
        <img src={Logo} alt="Team Logo" />
      </div>
      <p>By David Quintanilla, Jesse Israel, Husain Falih, Jose Mendoza</p>
      <h1>Numbers Games Accounting</h1> 
    </nav>
  );
}


export default NavBar;
