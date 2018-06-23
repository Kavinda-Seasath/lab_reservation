import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <nav class="navbar navbar-inverse">
        <div class="container-fluid">
          <div class="navbar-header">
            <Link to="/"><h1 className="navbar-brand text-white">Lab Reservation System</h1></Link>
          </div>


        </div>
    </nav>
  </header>
);

export default Header;
