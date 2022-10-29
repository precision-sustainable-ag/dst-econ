import {Card, CardContent, Icon} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import Draggable from 'react-draggable';

import './styles.scss';

export const Help = (props) => {
  const [helpX, setHelpX] = useState(0);
  const [helpY, setHelpY] = useState(0);
  const [moved, setMoved] = useState(false);

  const ref = useRef(null);
  const dragRef = useRef(null);
  const nodeRef = useRef(null);

  // in case ancestor is also draggable:
  if (nodeRef?.current && !moved) {
    setMoved(true);
    document.querySelector('#root').appendChild(nodeRef.current);
  }

  const style = {
    left: helpX,
    top: helpY,
    maxWidth:  `calc(100vw - ${helpX}px - 20px)`,
    maxHeight: `calc(94vh - ${helpY}px - 20px)`,
    transform: 'none',
    display: helpX === 0 ? 'none' : 'block',
  }

  useEffect(() => {
    const keydown = ({key}) => {
      if (key === 'Escape') {
        setHelpX(0);
        setHelpY(0);
      }
    };

    const click = (() => {
      setHelpX(0);
      setHelpY(0);
    });

    document.addEventListener('keydown', keydown);
    document.addEventListener('click', click);

    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('click', click);
    }
  }, []);

  return (
    <span ref={ref}>
      <Icon
        onClick={(e) => {
          if (helpX) {
            setHelpX(0);
            setHelpY(0);
          } else {
            dragRef.current.state.x = 0;
            dragRef.current.state.y = 0;
            setHelpX(Math.min(e.pageX + 20, window.innerWidth - 400));
            setHelpY(e.pageY - 20 - window.scrollY);
            e.stopPropagation();
          }
        }}
      >
        help
      </Icon>
      <Draggable
        ref={dragRef}
        nodeRef={nodeRef}
      >
        <Card
          ref={nodeRef}
          className="help"
          style={style}
          onClick={(e) => e.stopPropagation()}
        >
          <CardContent>
            {props.children}
          </CardContent>
        </Card>
      </Draggable>
    </span>
  )
} // Help
