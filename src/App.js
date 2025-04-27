import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import ManageMenu from './ManageMenu';
import AddMenu from './AddMenu';
import ManageUser from './ManageUser'; // ✅ เพิ่มตรงนี้

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/manage" element={<ManageMenu />} />
        <Route path="/add" element={<AddMenu />} />
        <Route path="/users" element={<ManageUser />} /> 
      </Routes>
    </Router>
  );
}

export default App;
