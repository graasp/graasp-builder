import React, { useEffect, useRef } from 'react';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { DRAG_ICON_SIZE } from '../../config/constants';
import { buildRowDraggerId } from '../../config/selectors';

const useStyles = makeStyles(() => ({
  dragIconContainer: {
    display: 'flex',
  },
  dragIcon: {
    fontSize: DRAG_ICON_SIZE,
  },
}));

const DragCellRenderer = ({ data: item, registerRowDragger }) => {
  const classes = useStyles();
  const dragRef = useRef(null);

  useEffect(() => {
    registerRowDragger(dragRef.current);
  });

  return (
    <div className={classes.dragIconContainer}>
      <DragIndicatorIcon
        id={buildRowDraggerId(item.id)}
        ref={dragRef}
        className={classes.dragIcon}
      />
    </div>
  );
};

DragCellRenderer.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  registerRowDragger: PropTypes.func.isRequired,
};

export default DragCellRenderer;
