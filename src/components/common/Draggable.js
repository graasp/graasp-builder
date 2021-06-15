import { Draggable } from 'react-beautiful-dnd';
import { TableRow } from '@material-ui/core';
import React from 'react';

const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,

  ...(isDragging && {
    background: 'rgb(235,235,235)',
  }),
});

const getVisibleChildren = (props, isDragging) => {
  if (isDragging) {
    const result = Array.from(props.children);
    // eslint-disable-next-line prefer-destructuring
    result[1] = result[1][0];
    return result;
  }
  return props.children;
};

const DraggableComponent = (id, index) => (props) => (
  <Draggable draggableId={id} index={index}>
    {(provided, snapshot) => (
      <TableRow
        ref={provided.innerRef}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...provided.draggableProps}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...provided.dragHandleProps}
        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...props}
      >
        {/* eslint-disable-next-line react/prop-types */}
        {getVisibleChildren(props, snapshot.isDragging)}
      </TableRow>
    )}
  </Draggable>
);

export default DraggableComponent;
