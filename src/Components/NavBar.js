import React, { useState } from 'react';
import './NavBar.css';
import HelpModal from './HelpModal'; 
import Logo from './AppLogo.png';
import Calandar from './Calandar'; // Import the Calandar component

const NavBar = () => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showCalandar, setShowCalandar] = useState(false); // State for calendar visibility

  const handleHelpClick = () => {
    setShowHelpModal(true);  
  };

  const handleCloseModal = () => {
    setShowHelpModal(false);  
  };

  const handleCalandarClick = () => {
    setShowCalandar(prevState => !prevState); // Toggle the calendar visibility
  };

  return (
    <div>
      <nav className="NavBar">
        <div className="NavBar-logo">
          <img src={Logo} alt="Team Logo" />
        </div>

        <button className="calandar-button" title="Opens the calendar" onClick={handleCalandarClick}>
          {showCalandar ? 'Calendar' : 'Calendar'}
        </button>

        <p>By David Quintanilla, Jesse Israel, Husain Falih, Jose Mendoza</p>
        <h1>Numbers Games Accounting</h1>

        <button className="help-button" title="Opens the help popup" onClick={handleHelpClick}>
          Help
        </button>

        <HelpModal show={showHelpModal} handleClose={handleCloseModal} />
      </nav>

      {/* Conditionally render the calendar based on state */}
      {showCalandar && <Calandar />}
    </div>
  );
};

export default NavBar;
