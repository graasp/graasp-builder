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
    // On drag, only the checkbox and item name will be shown in the row
    const checkbox = props.children[0];
    const name = props.children[1][0];
    return [checkbox, name];
  }
  return props.children;
};

const DraggableTableRow = (id, index) => (props) => (
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
        {getVisibleChildren(props, snapshot.isDragging)}
      </TableRow>
    )}
  </Draggable>
);

export default DraggableTableRow;
