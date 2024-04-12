import React from 'react';
import Avatar from 'react-avatar';

function Clients({ username, clientKey }) {
  return (
    <div className="clients" key={clientKey}>
      <Avatar name={username} size={50} round="14px" />
      <span className="username">{username}</span>
    </div>
  );
}

export default Clients;
