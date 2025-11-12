import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './style/App.css';


import PrivateRoute from './utils/protectedpaths';
import LoginForm from './pages/loginForms';
import RegisterForm from './pages/registerform';
import User from './pages/user';
import Home from './pages/home';
import { ETodoCalendar } from './pages/calendar';

function App() {
  return (
    <div className='App'>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path='/calendar' element={<ETodoCalendar/>}/>
          <Route element={<PrivateRoute/>}>
              <Route path='/user' element={<User/>} exact/>

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
      
  );
}

export default App;