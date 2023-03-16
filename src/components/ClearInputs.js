/* eslint-disable */
import {clearInputs} from '../store/Store';
import {Button} from '@mui/material';

export const ClearInputs = ({defaults}) => {
  return (
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
}