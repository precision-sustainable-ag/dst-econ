/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import { useSelector } from 'react-redux';
import { get } from '../../store/Store';

import './styles.scss';

const AT = () => {
  const at = useSelector(get.airTables);
  return (
    <div id="AT">
      <p>
        When approved, save as
        {' '}
        <strong>store/airtables.js</strong>
        :
      </p>
      <textarea autoFocus>
        {at}
      </textarea>
    </div>
  );
}; // Home

AT.menu = (
  <span>
    Ai
    <u>r</u>
    tables
  </span>
);

export default AT;
