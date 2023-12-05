import React from 'react';
import { Container, IconButton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const Print = () => (
  <Container sx={{ display: 'flex', justifyContent: 'flex-end' }}>
    <IconButton color="primary" sx={{ display: 'flex', justifyContent: 'flex-end' }} onClick={() => { window.print(); }}>
      <PrintIcon />
    </IconButton>
  </Container>
);

export default Print;
