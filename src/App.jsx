import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateRoom from './screens/CreateRoom';
import Expenses from './screens/Expenses';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/createroom" element={<CreateRoom />} />
        <Route path="/rooms" element={<CreateRoom />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/expenses" element={<Expenses />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
