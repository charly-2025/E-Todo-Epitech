import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './style/App.css';

import LoginForm from './pages/loginForms';
import RegisterForm from './pages/registerform';

function App() {
  return (
    <div className='App'>
      <div className='cercle1'></div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </BrowserRouter>
    </div>
      
  );
}

export default App;