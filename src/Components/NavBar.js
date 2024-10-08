import React, { useState } from 'react';
import './NavBar.css';
import HelpModal from './HelpModal'; // Import HelpModal component
import Logo from './AppLogo.png';

const NavBar = () => {
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleHelpClick = () => {
    setShowHelpModal(true);  // Show the modal when Help is clicked
  };

  const handleCloseModal = () => {
    setShowHelpModal(false);  // Hide the modal when Close is clicked
  };

  return (
    <nav className="NavBar">
      <div className="NavBar-logo">
        <img src={Logo} alt="Team Logo" />
      </div>
      <p>By David Quintanilla, Jesse Israel, Husain Falih</p>
      <h1>Numbers Games Accounting</h1>
      
      {/* Help Button */}
      <button className="help-button" onClick={handleHelpClick}>
        Help
      </button>

      {/* Help Modal */}
      <HelpModal show={showHelpModal} handleClose={handleCloseModal} />
    </nav>
  );
};

export default NavBar;