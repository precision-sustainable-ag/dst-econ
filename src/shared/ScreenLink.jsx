import { useDispatch } from 'react-redux';
import { set } from '../store/Store';

const ScreenLink = ({ to, children, ...props }) => {
  const dispatch = useDispatch();

  return (
    <button type="button" {...props} onClick={() => dispatch(set.screen(to))}>
      {children}
    </button>
  );
};

export default ScreenLink;
