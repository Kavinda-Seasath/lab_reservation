import React from 'react';
import Image from 'react-render-image';

import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <nav style={{backgroundColor:'black'}} className="nav-fill col-lg-12">
        <div className="container-fluid">

          <div className="">
            <h1 style={{textAlign:'center',color:'white'}} >Lab Reservation System</h1>
          </div>


        </div>
    </nav>
  </header>
);

export default Header;
