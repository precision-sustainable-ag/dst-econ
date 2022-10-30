import {Card, CardContent, Icon} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import Draggable from 'react-draggable';

import './styles.scss';

export const Help = (props) => {
  const ref = useRef(null);
  const dragRef = useRef(null);
  const nodeRef = useRef(null);

  const [open, setOpen] = useState(false);

  let top = 0;
  let left = 0;
  
  const rect = ref?.current?.getBoundingClientRect();

  if (rect) {
    top = rect.top;
    left = rect.left;
  }

  const style = {
    width:  `min(30rem, 100vw - ${left}px - 20px)`,
    maxHeight: `calc(94vh - ${top}px - 20px)`,
    overflow: 'auto',
    display: open ? 'block' : 'none',
  };

  useEffect(() => {
    const keydown = ({key}) => {
      if (key === 'Escape') {
        setOpen(false);
      }
    };

    const click = ((e) => {
      if (e.target !== ref.current) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', keydown);
    document.addEventListener('click', click);

    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('click', click);
    }
  }, []);

  return (
    <>
      <Icon
        ref={ref}
        onClick={() => {
          dragRef.current.state.x = 0;
          dragRef.current.state.y = 0;
          setOpen(!open);
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
    </>
  )
} // Help
