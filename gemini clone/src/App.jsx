/* eslint-disable no-unused-vars */
import React from 'react';
import Sidebar from './Components/Sidebar/Sidebar';
import Main from './Components/Main/Main';
import './index.css';

const App = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <Main />
    </div>
  );
}

export default App;
