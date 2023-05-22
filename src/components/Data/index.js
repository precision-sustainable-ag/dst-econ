import React from 'react';
import { useSelector } from 'react-redux';
import { get } from '../../store/Store';
import './styles.scss';

const Data = () => {
  const airTables = useSelector(get.airTables);
  return (
    <div id="Data">
      <p>
        Save to
        {' '}
        <strong>src/Store/airtables.js</strong>
        :
      </p>
      <textarea value={airTables}>{airTables}</textarea>
    </div>
  );
}; // Data

export default Data;
