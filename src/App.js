import React from 'react';
import logo from './assets/ESCM_Logo.png';
import { Typography } from '@mui/material';
import DemoButton from './demoButton';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          alt="Ethnic Studies Changemaker Logo"
          className="App-logo"
        />
        <Typography> Welcome to A.R.E.S</Typography>
        <Typography>Augmented Reality for Ethnic Studies</Typography>
        <DemoButton label="Web AR Demo" />
      </header>
    </div>
  );
}

export default App;
