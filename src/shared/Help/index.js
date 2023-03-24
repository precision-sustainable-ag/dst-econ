import React, { useRef, useState } from 'react';
import { Icon, Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';
import './styles.scss';

const Help = ({ children, ...otherProps }) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Icon
        ref={ref}
        onClick={() => {
          setOpen(!open);
        }}
      >
        help
      </Icon>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
      >
        <Box className="modal">
          <Typography {...otherProps}>
            {children}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}; // Help

export default Help;
