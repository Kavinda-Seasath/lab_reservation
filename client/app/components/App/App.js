import React, { Component } from 'react';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const App = ({ children }) => (
  <>
    <Header />

    <main>
      {children}
    </main>

    <br/>
    <Footer />
  </>
);

export default App;
