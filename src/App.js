import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar'; 
import RegisterPage from './Components/RegisterPage';
import LoginPage from './Components/LoginPage';
import ForgotPassword from './Components/ForgotPassword'; 



const App = () => {
  return (
    <div>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
};

export default App;