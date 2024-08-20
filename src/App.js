import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, CssBaseline } from '@mui/material';
import Playlist from './components/Playlist'; // Ensure this component exists
import PlaylistSection from './components/PlaylistSection'; // Ensure this component exists
import './App.css';

function App() {
  // const [playlists, setPlaylists] = useState([]);

  // useEffect(() => {
  //   const fetchPlaylists = async () => {
  //     try {
  //       // Updated URL to your API endpoint
  //       const response = await fetch('https://music-player-backend-theta.vercel.app/api/playlists');
  //       const data = await response.json();
  //       setPlaylists(data); // Ensure response data matches the expected structure
  //     } catch (error) {
  //       console.error('Error fetching playlists:', error);
  //       // Optionally, handle errors (e.g., show a message to the user)
  //     }
  //   };

  //   fetchPlaylists();
  // }, []);

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

      {/* {playlists.length > 0 ? (
        playlists.map((playlist) => (
          <Playlist key={playlist.id} playlist={playlist} />
        ))
      ) : (
        <Typography variant="body1" className="noPlaylists">
          No playlists available.
        </Typography>
      )} */}
      
      <PlaylistSection />
    </div>
  );
}

export default App;
