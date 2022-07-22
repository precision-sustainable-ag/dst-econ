import {clearInputs} from '../store/store';
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
    >
      Clear inputs
    </Button>
  );
}