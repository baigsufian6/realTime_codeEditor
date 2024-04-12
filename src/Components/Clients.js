const React = require('react');
const Avatar = require('react-avatar').default; 

function Clients({ username, clientKey }) { // Change key to clientKey
  return (
    React.createElement('div', { className: 'clients', key: clientKey }, // Use clientKey as the key prop
      React.createElement(Avatar, { name: username, size: 50, round: '14px' }),
      React.createElement('span', { className: 'username' }, username),
  
    )
  );
}

module.exports = Clients;
