import React, { useState } from 'react';
import './NavBar.css';
import HelpModal from './HelpModal'; 
import Logo from './AppLogo.png';

const NavBar = () => {
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleHelpClick = () => {
    setShowHelpModal(true);  
  };

  const handleCloseModal = () => {
    setShowHelpModal(false);  
  };

  return (
    <nav className="NavBar">
      <div className="NavBar-logo">
        <img src={Logo} alt="Team Logo" />
      </div>
      <p>By David Quintanilla, Jesse Israel, Husain Falih</p>
      <h1>Numbers Games Accounting</h1>
      
     
      <button className="help-button" title = "Opens the help popup" onClick={handleHelpClick}>
        Help
      </button>

      
      <HelpModal show={showHelpModal} handleClose={handleCloseModal} />
    </nav>
  );
};

export default NavBar;