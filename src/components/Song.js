import React from 'react';

function Song({ song }) {
  return (
    <div className="song">
      <h3>{song.title}</h3>
      <p>{song.artist}</p>
    </div>
  );
}

export default Song;
