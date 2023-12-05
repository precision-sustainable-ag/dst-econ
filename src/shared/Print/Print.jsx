import React from 'react';
import { Container, IconButton, Tooltip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const Print = () => (
  <Container sx={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Tooltip title="Print">
      <IconButton color="primary" sx={{ display: 'flex', justifyContent: 'flex-end' }} onClick={() => { window.print(); }}>
        <PrintIcon />
      </IconButton>
    </Tooltip>
  </Container>
);

export default Print;
