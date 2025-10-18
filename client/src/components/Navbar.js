import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">
        <Link to="/">VideoMeet</Link>
      </h1>
      <ul>
        <li>
          <Link to="/create">Create Meeting</Link>
        </li>
        <li>
          <Link to="/schedule">Schedule Meeting</Link>
        </li>
        <li>
          <Link to="/my-meetings">My Meetings</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;