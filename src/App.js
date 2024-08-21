import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, CssBaseline } from '@mui/material';
import Playlist from './components/Playlist'; 
import PlaylistSection from './components/PlaylistSection'; 
import './App.css';

function App() {

  return (
    <div className="App">
      <CssBaseline />
      <AppBar position="static" className="appBar">
        <Toolbar>
          <Typography variant="h6" className="title">
            Music Details
          </Typography>
        </Toolbar>
      </AppBar>

      {

      }
      
      <PlaylistSection />
    </div>
  );
}

export default App;
