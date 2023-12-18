import React, { useRef } from 'react';
import { IconButton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import Field from '../../components/Field';

const Print = ({ printedComponent }) => {
  const ref = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  return (
    <>
      <IconButton
        color="primary"
        edge="end"
        sx={{ marginLeft: 1, padding: 0 }}
        onClick={handlePrint}
      >
        <PrintIcon />
      </IconButton>
      <div style={{ display: 'none' }} ref={ref}>
        <Field />
      </div>
    </>
  );
};

Print.displayName = 'PrintComponent';

export default Print;
