import React from 'react';
import { IconButton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const Print = () => (
  <IconButton color="primary" edge="end" sx={{ marginLeft: 1, padding: 0 }} onClick={() => { window.print(); }}>
    <PrintIcon />
  </IconButton>
);

export default Print;
