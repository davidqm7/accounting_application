import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar'; 
import RegisterPage from './Components/RegisterPage';
import LoginPage from './Components/LoginPage';
import ForgotPassword from './Components/ForgotPassword'; 
import AdminDashboard from './Components/AdminDashboard';
import UserReport from './Components/UserReport'; 
import SendEmail from './Components/SendEmail';
import CreateUser from './Components/CreateUser'; 
import Activation from './Components/Activation';
import RegularDashboard from './Components/RegularDashboard'; 
import ManagerDashboard from './Components/ManagerDashboard'; 
import ResetPassword from './Components/ResetPassword';
import RegularGetEmail from './Components/RegularGetEmail';
import ManagerGetEmail from './Components/ManagerGetEmail';
import ManagerUserReport from './Components/ManagerUserReport';
import RegularUserReport from './Components/RegularUserReport';
import UserJournalizing from './Components/UserJournalizing';
import ManagerJournalizing from './Components/ManagerJournalizing';
import EventLog from './Components/EventLog';
import Details from './Components/Details'; 
import Edits from './Components/Edits'; 
import GeneralLedger from './Components/GeneralLedger';
import JournalEntry from './Components/JournalEntry';
import TrialBalance from './Components/TrialBalance';
import IncomeStatement from './Components/IncomeStatement';
import BalanceSheet from './Components/BalanceSheet';
import EarningsStatement from './Components/EarningStatement';
import LandingPage from './Components/LandingPage';

const App = () => {

  return (
    <div>
      {/* Navbar is rendered at the top of every page */}
      <NavBar></NavBar>
      <Routes>
        
      {/* Routes for all the different pages in the application */}

      <Route path="/" element={<LoginPage />} /> 
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<RegisterPage />} />   
      <Route path="/landing" element={<LandingPage />} />   
        
        {/* Admin-related routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/email" element={<SendEmail />} />
      <Route path="/create-user" element={<CreateUser />} />
      <Route path="/activation" element={<Activation />} />
      <Route path="/report" element={<UserReport />} />
      <Route path="/event-log" element={<EventLog />} />
      <Route path="/details/:uid" element={<Details />} />
      <Route path="/edits/:uid" element={<Edits />} />

     {/* Manager-related routes */}
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/manager-get-email" element={<ManagerGetEmail />} />
      <Route path="/manager-user-report" element={<ManagerUserReport />} />
      <Route path="/manager-journalizing" element={<ManagerJournalizing />} />
      <Route path="/trial-balance" element={<TrialBalance />} />
      <Route path="/income-statement" element={<IncomeStatement />} />
      <Route path="/balance-sheet" element={<BalanceSheet />} />
      <Route path="/retained-earnings-statement" element={<EarningsStatement />} />


    {/* Regular user-related routes */}
      <Route path="/user-dashboard" element={<RegularDashboard />} />
      <Route path="/reg-get-email" element={<RegularGetEmail />} />
      <Route path="/regular-user-report" element={<RegularUserReport />} />
      <Route path="/user-journalizing/:entryId" element={<UserJournalizing />} />
      <Route path="/general-ledger" element={<GeneralLedger />} />
      <Route path="/journal-entry" element={<JournalEntry />} />


    </Routes>

    </div>
  );
};

export default App;