/* eslint-disable no-alert */
import React from 'react';
import { Button } from '@mui/material';
import { clearInputs } from '../store/Store';

const ClearInputs = ({ defaults }) => (
  <Button
    className="clearInputs"
    variant="contained"
    size="small"
    onClick={() => {
      if (window.confirm('Clear this module?')) {
        clearInputs(defaults);
      }
    }}
    title="Clear all inputs for the current module."
  >
    Clear inputs
  </Button>
);

export default ClearInputs;
