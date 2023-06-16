import React from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '@mui/material';
import { set } from '../../store/redux-autosetters';
import './styles.scss';

const Help = ({ children }) => {
  const dispatch = useDispatch();

  return (
    <Icon
      style={{ marginLeft: '0.3rem' }}
      onClick={(event) => {
        dispatch(set.anchor(event.currentTarget));
        dispatch(set.modalData(children));
      }}
    >
      help
    </Icon>
  );
}; // Help

export default Help;
