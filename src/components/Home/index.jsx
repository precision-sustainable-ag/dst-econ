import { Link } from 'react-router-dom';

import React from 'react';
import { dev, exampleHome } from '../../store/Store';

import './styles.scss';

const Home = () => (
  <div id="Home">
    <a href="https://precisionsustainableag.org/">
      <img src="PSAlogo-text.png" alt="logo" id="PSALogo" />
    </a>

    <p>Welcome to the</p>
    <h1>
      Cover Crop Economic Decision Support Tool
      {' '}
      <span style={{ whiteSpace: 'nowrap' }}>(CC-ECON)</span>
    </h1>
    <p>This program helps growers understand the impact of cover crops on profitability when making crop management changes.</p>

    <div className="home-button-container">
      <Link className="link about" to="/About">ABOUT</Link>
      <Link className="link location" to="/Field">GET STARTED</Link>
    </div>

    <img className="crops fullwidth" src="background.png" alt="" />

    {dev && (
      <div className="test-buttons">
        <button
          type="button"
          onClick={exampleHome}
        >
          Test data
        </button>
      </div>
    )}
  </div>
); // Home

Home.menu = (
  <span>
    <u>H</u>
    ome
  </span>
);

export default Home;
