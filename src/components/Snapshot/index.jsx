import React from 'react';
import { SummaryDetails } from '../Activity';

const Snapshot = () => {
  console.log('snapshot');
  return (
    <SummaryDetails view="MOBILE" />
  );
};

Snapshot.menu = (
  <span>
    Sna
    <u>p</u>
    shot
  </span>
);

export default Snapshot;
