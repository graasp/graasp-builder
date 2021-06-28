import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { TableBody } from '@material-ui/core';
import React from 'react';

const DroppableTableBody = (onDragEnd) => (props) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="1" direction="vertical">
      {(provided) => (
        <TableBody
          ref={provided.innerRef}
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...provided.droppableProps}
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...props}
        >
          {/* eslint-disable-next-line react/prop-types */}
          {props.children}
          {provided.placeholder}
        </TableBody>
      )}
    </Droppable>
  </DragDropContext>
);

export default DroppableTableBody;
