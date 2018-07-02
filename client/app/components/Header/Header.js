import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <nav  className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/"><h1 className="navbar-brand text-white">Lab Reservation System</h1></Link>
          </div>


        </div>
    </nav>
  </header>
);

export default Header;
