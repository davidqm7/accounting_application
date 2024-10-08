import React from 'react';
import './HelpModal.css'; 

const HelpModal = ({ show, handleClose }) => {
  if (!show) {
    return null; 
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Help Topics</h2>
        <div className="help-section">
          <h3>User Roles and Permissions</h3>
          <p>
            The application supports three types of users:
            <ul>
              <li><strong>Administrator</strong>: Manages users, assigns roles, adds accounts, and oversees system operations.</li>
              <li><strong>Manager</strong>: Views and reviews transactions, but cannot modify accounts.</li>
              <li><strong>Regular User</strong>: Records transactions and generates reports, but cannot add or edit accounts.</li>
            </ul>
          </p>
        </div>
        <div className="help-section">
          <h3>Login and Security Features</h3>
          <p>
            The login page includes:
            <ul>
              <li>Username and password fields with password visibility hidden for security.</li>
              <li>Strong password requirements (minimum 8 characters, must include letters, numbers, and special characters).</li>
              <li>Options for password recovery, and users receive notifications for upcoming password expiration.</li>
              <li>After three unsuccessful attempts, users are temporarily suspended.</li>
            </ul>
          </p>
        </div>
        <div className="help-section">
          <h3>Chart of Accounts</h3>
          <p>
            The Administrator can manage the chart of accounts:
            <ul>
              <li>Add, view, edit, and deactivate accounts.</li>
              <li>Ensure no duplicate account names or numbers.</li>
              <li>Accounts with a balance greater than zero cannot be deactivated.</li>
              <li>Search and filter accounts by name, number, category, subcategory, or amount.</li>
            </ul>
          </p>
        </div>
        <div className="help-section">
          <h3>Journalizing Transactions</h3>
          <p>
            Transactions can be entered by selecting accounts from the chart of accounts. Debits and credits must balance before a transaction can be saved.
            <ul>
              <li>Only approved transactions can be posted.</li>
              <li>Managers and accountants can review but not approve transactions.</li>
            </ul>
          </p>
        </div>
        <div className="help-section">
          <h3>Reporting Features</h3>
          <p>
            Users can generate various financial reports, including:
            <ul>
              <li>Trial Balance: Shows accounts with balances greater than zero.</li>
              <li>Income Statement, Balance Sheet, and Cash Flow Statement: For the selected accounting year.</li>
              <li>Ratio Analysis: Highlights items that are out of range.</li>
            </ul>
          </p>
        </div>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default HelpModal;
