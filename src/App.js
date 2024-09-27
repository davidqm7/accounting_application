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


const App = () => {
  return (
    <div>
      <NavBar></NavBar>
      <Routes>
        
        { /* <Route path="/" element={<AdminDashboard />} />*/}

        <Route path="/" element={<LoginPage />} /> 
       <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/register" element={<RegisterPage />} /> 
        

        { /* <Route path="/email" element={<SendEmail />} />*/}
        { /* <Route path="/create-user" element={<CreateUser />} />*/}
        { /* <Route path="/activation" element={<Activation />} />*/}
        { /* <Route path="/report" element={<UserReport />} />*/}
        { /* <Route path="/update" element={<UpdateInformation />} />*/}
        {/* <Route path="/" element={<RegularDashboard />} />*/}
        {/* <Route path="/" element={<ManagerDashboard />} />*/}

      </Routes>
    </div>
  );
};

export default App;