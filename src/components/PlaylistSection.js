import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, TextField, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import './PlaylistSection.css';

function PlaylistSection() {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedPlaylistName, setEditedPlaylistName] = useState('');
  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState(null);
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    album: '',  
    duration: '',
    url: ''   
  });
  const [editingSongIndex, setEditingSongIndex] = useState(null);
  const [editedSong, setEditedSong] = useState({
    title: '',
    artist: '',
    album: '',  
    duration: '',
    url: ''     
  });

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('https://music-player-backend-theta.vercel.app/api/playlists/read');
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  const fetchSongs = async (playlistId) => {
    try {
      const response = await axios.get(`https://music-player-backend-theta.vercel.app/api/songs/read?pid=${playlistId}`);
      const updatedPlaylists = playlists.map((playlist, index) =>
        index === selectedPlaylistIndex ? { ...playlist, songs: response.data } : playlist
      );
      setPlaylists(updatedPlaylists);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handlePlaylistSelect = (index) => {
    setSelectedPlaylistIndex(index);
    const selectedPlaylist = playlists[index];
    fetchSongs(selectedPlaylist._id);
  };

  const addPlaylist = async () => {
    if (newPlaylistName.trim()) {
      try {
        const response = await axios.post('https://music-player-backend-theta.vercel.app/api/playlists/add', {
          name: newPlaylistName,
          description: '',
          songIds: []
        });
        setPlaylists([...playlists, response.data]);
        setNewPlaylistName('');
      } catch (error) {
        console.error('Error adding playlist:', error);
      }
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedPlaylistName(playlists[index].name);
  };

  const saveEdit = async () => {
    if (editedPlaylistName.trim()) {
      try {
        const playlistToUpdate = playlists[editingIndex];
        const response = await axios.put(`https://music-player-backend-theta.vercel.app/api/playlists/update/${playlistToUpdate._id}`, {
          name: editedPlaylistName,
          description: playlistToUpdate.description,
          songIds: playlistToUpdate.songs.map(song => song._id)
        });
        const updatedPlaylists = playlists.map((playlist, index) =>
          index === editingIndex ? response.data : playlist
        );
        setPlaylists(updatedPlaylists);
        setEditingIndex(null);
        setEditedPlaylistName('');
      } catch (error) {
        console.error('Error updating playlist:', error);
      }
    }
  };

  const deletePlaylist = async (index) => {
    const playlistToDelete = playlists[index];
    try {
      await axios.delete(`https://music-player-backend-theta.vercel.app/api/playlists/delete/${playlistToDelete._id}`);
      const updatedPlaylists = playlists.filter((_, i) => i !== index);
      setPlaylists(updatedPlaylists);
      if (selectedPlaylistIndex === index) {
        setSelectedPlaylistIndex(null);
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const handleNewSongChange = (e) => {
    const { name, value } = e.target;
    setNewSong(prevState => ({ ...prevState, [name]: value }));
  };

 
  const addSong = async () => {
    if (Object.values(newSong).every(val => val.trim()) && selectedPlaylistIndex !== null) {
      try {
        const playlistId = playlists[selectedPlaylistIndex]._id; // Get the selected playlist ID
        const songWithPlaylist = { ...newSong, playlist_id: playlistId }; // Add playlist_id to the song object
        
        const response = await axios.post('https://music-player-backend-theta.vercel.app/api/songs/add', songWithPlaylist);
        
        const updatedPlaylists = [...playlists];
        updatedPlaylists[selectedPlaylistIndex].songs.push(response.data);
        
        setPlaylists(updatedPlaylists);
        setNewSong({
          title: '',
          artist: '',
          album: '',  
          duration: '',
          url: ''    
        });
        
        // Refresh the song list by fetching the songs again
        fetchSongs(playlistId); 
  
      } catch (error) {
        console.error('Error adding song:', error);
      }
    }
  };
  




  const startEditingSong = (index) => {
    setEditingSongIndex(index);
    setEditedSong(playlists[selectedPlaylistIndex].songs[index]);
  };

  const handleEditedSongChange = (e) => {
    const { name, value } = e.target;
    setEditedSong(prevState => ({ ...prevState, [name]: value }));
  };

  const saveEditSong = async () => {
    if (Object.values(editedSong).every(val => val.trim())) {
      try {
        const songToUpdate = playlists[selectedPlaylistIndex].songs[editingSongIndex];
        const response = await axios.put(`https://music-player-backend-theta.vercel.app/api/songs/update/${songToUpdate._id}`, editedSong);
        const updatedSongs = playlists[selectedPlaylistIndex].songs.map((song, index) =>
          index === editingSongIndex ? response.data : song
        );
        const updatedPlaylists = playlists.map((playlist, index) =>
          index === selectedPlaylistIndex ? { ...playlist, songs: updatedSongs } : playlist
        );
        setPlaylists(updatedPlaylists);
        setEditingSongIndex(null);
        setEditedSong({
          title: '',
          artist: '',
          album: '',  
          duration: '',
          url: ''    
        });
      } catch (error) {
        console.error('Error updating song:', error);
      }
    }
  };

  const deleteSong = async (index) => {
    const songToDelete = playlists[selectedPlaylistIndex].songs[index];
    try {
      await axios.delete(`https://music-player-backend-theta.vercel.app/api/songs/delete/${songToDelete._id}`);
      const updatedSongs = playlists[selectedPlaylistIndex].songs.filter((_, i) => i !== index);
      const updatedPlaylists = playlists.map((playlist, index) =>
        index === selectedPlaylistIndex ? { ...playlist, songs: updatedSongs } : playlist
      );
      setPlaylists(updatedPlaylists);
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  return (
    <Box className="playlist-container">
      {/* Playlist Header */}
      <Box className="playlist-header-container">
        <Typography variant="h6" component="div" className="playlist-header">
          Playlists
        </Typography>
        <Box className="playlist-input-container">
          <TextField
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            label="Add new playlist"
            variant="outlined"
            size="small"
            className="playlist-input"
          />
          <IconButton color="primary" onClick={addPlaylist} className="add-icon-button">
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Playlist List */}
      <Box sx={{ marginTop: '16px' }}>
        <Typography variant="body1">Playlists:</Typography>
        <List className="playlist-list">
          {playlists.map((playlist, index) => (
            <ListItem
              key={index}
              className="playlist-list-item"
              button
              onClick={() => handlePlaylistSelect(index)}
            >
              {editingIndex === index ? (
                <TextField
                  value={editedPlaylistName}
                  onChange={(e) => setEditedPlaylistName(e.target.value)}
                  label="Edit playlist name"
                  variant="outlined"
                  size="small"
                  className="playlist-edit-input"
                />
              ) : (
                <ListItemText primary={playlist.name} />
              )}
              <ListItemSecondaryAction>
                {editingIndex === index ? (
                  <IconButton color="primary" onClick={saveEdit}>
                    <SaveIcon />
                  </IconButton>
                ) : (
                  <>
                    <IconButton edge="end" color="primary" onClick={() => startEditing(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" color="secondary" onClick={() => deletePlaylist(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Song List */}
      {selectedPlaylistIndex !== null && (
        <Box sx={{ marginTop: '24px' }}>
          <Typography variant="body1">
            Songs in "{playlists[selectedPlaylistIndex].name}":
          </Typography>
          <Box className="song-input-container">
            <TextField
              name="title"
              value={newSong.title}
              onChange={handleNewSongChange}
              label="Song Title"
              variant="outlined"
              size="small"
              className="song-input"
            />
            <TextField
              name="artist"
              value={newSong.artist}
              onChange={handleNewSongChange}
              label="Artist"
              variant="outlined"
              size="small"
              className="song-input"
            />
            <TextField
              name="album"
              value={newSong.album}
              onChange={handleNewSongChange}
              label="Album"
              variant="outlined"
              size="small"
              className="song-input"
            />
            <TextField
              name="duration"
              value={newSong.duration}
              onChange={handleNewSongChange}
              label="Duration"
              variant="outlined"
              size="small"
              className="song-input"
            />
            <TextField
              name="url"
              value={newSong.url}
              onChange={handleNewSongChange}
              label="URL"
              variant="outlined"
              size="small"
              className="song-input"
            />
            <IconButton color="primary" onClick={addSong}>
              <AddIcon />
            </IconButton>
          </Box>

          <List className="song-list">
            {playlists[selectedPlaylistIndex].songs.map((song, index) => (
              <ListItem key={index} className="song-list-item">
                {editingSongIndex === index ? (
                  <TextField
                    name="title"
                    value={editedSong.title}
                    onChange={handleEditedSongChange}
                    label="Edit Song Title"
                    variant="outlined"
                    size="small"
                    className="song-edit-input"
                  />
                ) : (
                  <ListItemText primary={song.title} />
                )}
                <ListItemSecondaryAction>
                  {editingSongIndex === index ? (
                    <IconButton color="primary" onClick={saveEditSong}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <>
                   
                      <IconButton edge="end" color="secondary" onClick={() => deleteSong(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

export default PlaylistSection;
