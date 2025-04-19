// useSafeDragDropManager.ts
import { useContext } from 'react';
import { DndContext } from 'react-dnd';

/**
 * Custom hook to safely get the dragDropManager from the existing context.
 * This assumes Strapi's AdminLayout already includes a DndProvider.
 */
export const useSafeDragDropManager = () => {
  const context = useContext(DndContext);

  if (!context || !context.dragDropManager) {
    throw new Error('DragDropManager not available. Make sure this is rendered within the existing DndProvider.');
  }

  return context.dragDropManager;
};
