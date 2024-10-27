import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar'; 
import RegisterPage from './Components/RegisterPage';
import LoginPage from './Components/LoginPage';
import ForgotPassword from './Components/ForgotPassword'; 
import AdminDashboard from './Components/AdminDashboard';
import UserReport from './Components/UserReport'; 
import UpdateInformation from './Components/UpdateInformation';
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
import AdminJournalizing from './Components/AdminJournalizing';
import EventLog from './Components/EventLog';
import Details from './Components/Details'; 
import Edits from './Components/Edits'; 
import GeneralLedger from './Components/GeneralLedger';
import JournalEntry from './Components/JournalEntry';

const App = () => {

  return (
    <div>
      <NavBar></NavBar>
      <Routes>
        

      <Route path="/" element={<LoginPage />} /> 
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<RegisterPage />} />   
        
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/email" element={<SendEmail />} />
      <Route path="/create-user" element={<CreateUser />} />
      <Route path="/activation" element={<Activation />} />
      <Route path="/report" element={<UserReport />} />
      <Route path="/update" element={<UpdateInformation />} />
      <Route path="/admin-journalizing" element={<AdminJournalizing />} />
      <Route path="/event-log" element={<EventLog />} />
      <Route path="/details/:uid" element={<Details />} />
      <Route path="/edits/:uid" element={<Edits />} />

      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/manager-get-email" element={<ManagerGetEmail />} />
      <Route path="/manager-user-report" element={<ManagerUserReport />} />
      <Route path="/manager-journalizing" element={<ManagerJournalizing />} />

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