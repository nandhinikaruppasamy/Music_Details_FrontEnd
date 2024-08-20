import React from 'react';
import Song from './Song';

function Playlist({ playlist }) {
  return (
    <div className="playlist">
      <h2>{playlist.name}</h2>
      <div className="songs">
        {playlist.songs.map(song => (
          <Song key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}

export default Playlist;
