import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, TextField, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import './PlaylistSection.css';
import axios from 'axios';

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
    const fetchSongs = async () => {
      try {
        const response = await axios.get('https://music-player-backend-theta.vercel.app/api/songs');
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };
    fetchSongs();
  }, []);

  const addPlaylist = async () => {
    if (newPlaylistName.trim()) {
      try {
        const response = await axios.post('https://music-player-backend-theta.vercel.app/api/playlists', {
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
        const response = await axios.put(`https://music-player-backend-theta.vercel.app/api/playlists/${playlistToUpdate._id}`, {
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
      await axios.delete(`https://music-player-backend-theta.vercel.app/api/playlists/${playlistToDelete._id}`);
      const updatedPlaylists = playlists.filter((_, i) => i !== index);
      setPlaylists(updatedPlaylists);
      if (selectedPlaylistIndex === index) {
        setSelectedPlaylistIndex(null);
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const handlePlaylistSelect = (index) => {
    setSelectedPlaylistIndex(index);
  };

  const handleNewSongChange = (e) => {
    const { name, value } = e.target;
    setNewSong(prevState => ({ ...prevState, [name]: value }));
  };

  const addSong = async () => {
    if (Object.values(newSong).every(val => val.trim()) && selectedPlaylistIndex !== null) {
      try {
        const response = await axios.post('https://music-player-backend-theta.vercel.app/api/songs', newSong);
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
        const response = await axios.put(`http://localhost:5000/api/songs/${songToUpdate._id}`, editedSong);
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
      await axios.delete(`https://music-player-backend-theta.vercel.app/api/songs/${songToDelete._id}`);
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
                  variant="outlined"
                  size="small"
                  className="edit-playlist"
                />
              ) : (
                <ListItemText primary={playlist.name} />
              )}
              <ListItemSecondaryAction>
                {editingIndex === index ? (
                  <IconButton edge="end" color="primary" onClick={saveEdit}>
                    <SaveIcon />
                  </IconButton>
                ) : (
                  <>
                    <IconButton edge="end" color="primary" onClick={() => startEditing(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" color="error" onClick={() => deletePlaylist(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Song Section */}
      {selectedPlaylistIndex !== null && (
        <Box className="song-section">
          <Typography variant="h6" component="div" className="song-header">
            Songs
          </Typography>
          <Box className="song-input-container">
            <TextField
              name="title"
              value={newSong.title}
              onChange={handleNewSongChange}
              label="Title"
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
              name="album"  // Updated key
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
            <IconButton color="primary" onClick={addSong} className="add-icon-button">
              <AddIcon />
            </IconButton>
          </Box>

          {/* Song List */}
          <List className="song-list">
            {playlists[selectedPlaylistIndex].songs.map((song, index) => (
              <ListItem key={index} className="song-list-item">
                {editingSongIndex === index ? (
                  <>
                    <TextField
                      name="title"
                      value={editedSong.title}
                      onChange={handleEditedSongChange}
                      label="Title"
                      variant="outlined"
                      size="small"
                      className="edit-song"
                    />
                    <TextField
                      name="artist"
                      value={editedSong.artist}
                      onChange={handleEditedSongChange}
                      label="Artist"
                      variant="outlined"
                      size="small"
                      className="edit-song"
                    />
                    <TextField
                      name="album"  // Updated key
                      value={editedSong.album}
                      onChange={handleEditedSongChange}
                      label="Album"
                      variant="outlined"
                      size="small"
                      className="edit-song"
                    />
                    <TextField
                      name="duration"
                      value={editedSong.duration}
                      onChange={handleEditedSongChange}
                      label="Duration"
                      variant="outlined"
                      size="small"
                      className="edit-song"
                    />
                    <TextField
                      name="url"  
                      value={editedSong.url}
                      onChange={handleEditedSongChange}
                      label="URL"
                      variant="outlined"
                      size="small"
                      className="edit-song"
                    />
                  </>
                ) : (
                  <>
                    <ListItemText primary={song.title} secondary={`${song.artist} - ${song.album}`} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" color="primary" onClick={() => startEditingSong(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" color="error" onClick={() => deleteSong(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

export default PlaylistSection;
