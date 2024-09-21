import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar'; 
import RegisterPage from './Components/RegisterPage';



const App = () => {
  return (
    <div>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        {/*<Route path="/login" element={<LoginPage />} />*/}
      </Routes>
    </div>
  );
};

export default App;