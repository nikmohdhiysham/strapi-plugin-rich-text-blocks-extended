import * as React from 'react';
import { useDragAndDrop, UseDragAndDropOptions, UseDragAndDropReturn } from './useDragAndDrop';
import { useContext } from 'react';
import { DndContext } from 'react-dnd';

const useSafeDragDropManager = () => {
  const context = useContext(DndContext);
  return !!context?.dragDropManager;
};

export const useSafeDragAndDrop = <
  TIndex extends number | Array<number>,
  TItem extends { index: TIndex; [key: string]: unknown } = {
    index: TIndex;
    [key: string]: unknown;
  },
  E extends Element = HTMLElement,
>(
  active: boolean,
  options: UseDragAndDropOptions<TIndex, TItem>
): UseDragAndDropReturn<E> => {
  const isDndAvailable = useSafeDragDropManager();
  
  if (isDndAvailable) {
    return useDragAndDrop<TIndex, TItem, E>(active, options);
  }
  
  // Use type assertion to tell TypeScript to trust the ref type
  const dummyObjectRef = {} as React.RefObject<E>;
  const dummyConnector = (el: any) => el;
  
  return [
    {
      handlerId: null,
      isDragging: false,
      handleKeyDown: () => {},
      isOverDropTarget: false,
      direction: null,
    },
    dummyObjectRef,
    dummyConnector,
    dummyConnector,
    dummyConnector
  ];
};