import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { DraggableItem } from './DraggableItem';

export function OrderGroup({ orderMembers, onOrderChange, onReorder }: any) {
  return (
    <DragDropContext
      onDragEnd={({ source, destination }) => { onReorder(source && source.index, destination && destination.index); }}
    >
      <Droppable droppableId="droppable">
        {
          provided => (
            <div ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ paddingTop: 8, width: 260 }}
            >
              {
                orderMembers.map(({ id, title, order }: any, index: any) => (
                  <DraggableItem key={id} id={id} index={index} order={order} onOrderChange={onOrderChange}>
                    {title}
                  </DraggableItem>
                ))}

              {provided.placeholder}
            </div>
          )
        }
      </Droppable>
    </DragDropContext>
  );
}