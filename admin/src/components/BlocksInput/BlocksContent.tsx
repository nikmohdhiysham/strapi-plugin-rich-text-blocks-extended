import * as React from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  closestCenter,
  DragEndEvent
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  Box,
  BoxComponent,
  Flex,
  FlexComponent,
  IconButton,
  IconButtonComponent,
} from '@strapi/design-system';
import { Drag } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { Editor, Range, Transforms } from 'slate';
import { ReactEditor, type RenderElementProps, type RenderLeafProps, Editable } from 'slate-react';
import { styled, CSSProperties, css } from 'styled-components';

import { DIRECTIONS } from '../../hooks/useDragAndDrop';
import { getTranslation } from '../../utils/getTranslation';

import { decorateCode } from './Blocks/Code';
import { type BlocksStore, useBlocksEditorContext } from './BlocksEditor';
import { useConversionModal } from './BlocksToolbar';
import { type ModifiersStore } from './Modifiers';
import { CustomElement, CustomText, getEntries, isLinkNode, isListNode } from './utils/types';

const StyledEditable = styled(Editable)<{ $isExpandedMode: boolean }>`
  // The outline style is set on the wrapper with :focus-within
  outline: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaces[3]};
  height: 100%;
  // For fullscreen align input in the center with fixed width
  width: ${({ $isExpandedMode }) => ($isExpandedMode ? '512px' : '100%')};
  margin: auto;

  > *:last-child {
    padding-bottom: ${({ theme }) => theme.spaces[3]};
  }
`;

const Wrapper = styled<BoxComponent>(Box)<{ $isOverDropTarget: boolean }>`
  position: ${({ $isOverDropTarget }) => $isOverDropTarget && 'relative'};
`;

type DragDirection = (typeof DIRECTIONS)[keyof typeof DIRECTIONS];

const DropPlaceholder = styled<BoxComponent>(Box)<{
  $dragDirection: DragDirection | null;
  $placeholderMargin: 1 | 2;
}>`
  position: absolute;
  right: 0;

  // Show drop placeholder 8px above or below the drop target
  ${({ $dragDirection,  theme, $placeholderMargin }) => css`
    top: ${$dragDirection === DIRECTIONS.UPWARD && `-${theme.spaces[$placeholderMargin]}`};
    bottom: ${$dragDirection === DIRECTIONS.DOWNWARD && `-${theme.spaces[$placeholderMargin]}`};
  `}
`;

const DragItem = styled<FlexComponent>(Flex)<{ $dragVisibility: CSSProperties['visibility'] }>`
  // Style each block rendered using renderElement()
  & > [data-slate-node='element'] {
    width: 100%;
    opacity: inherit;
  }

  // Set the visibility of drag button
  [role='button'] {
    visibility: ${(props) => props.$dragVisibility};
    opacity: inherit;
  }
  &[aria-disabled='true'] {
    user-drag: none;
  }
`;

const DragIconButton = styled<IconButtonComponent<'div'>>(IconButton)<{
  $dragHandleTopMargin?: CSSProperties['marginTop'];
}>`
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding-left: ${({ theme }) => theme.spaces[0]};
  padding-right: ${({ theme }) => theme.spaces[0]};
  padding-top: ${({ theme }) => theme.spaces[1]};
  padding-bottom: ${({ theme }) => theme.spaces[1]};
  visibility: hidden;
  cursor: grab;
  opacity: inherit;
  margin-top: ${(props) => props.$dragHandleTopMargin ?? 0};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }
  &:active {
    cursor: grabbing;
    background: ${({ theme }) => theme.colors.neutral150};
  }
  &[aria-disabled='true'] {
    visibility: hidden;
  }
  svg {
    min-width: ${({ theme }) => theme.spaces[3]};

    path {
      fill: ${({ theme }) => theme.colors.neutral500};
    }
  }
`;

type Direction = {
  setDragDirection: (direction: DragDirection) => void;
  dragDirection: DragDirection | null;
};

type DragAndDropElementProps = Direction & {
  children: RenderElementProps['children'];
  index: Array<number>;
  dragHandleTopMargin?: CSSProperties['marginTop'];
};

const SortableDragAndDropElement = ({
  children,
  index,
  setDragDirection,
  dragDirection,
  dragHandleTopMargin,
}: DragAndDropElementProps) => {
  const { editor, disabled, name, setLiveText } = useBlocksEditorContext('drag-and-drop');
  const { formatMessage } = useIntl();
  const [dragVisibility, setDragVisibility] = React.useState<CSSProperties['visibility']>('hidden');

  // Use useSortable from dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver: isOverDropTarget,
  } = useSortable({ 
    id: String(index[0]),
    disabled: disabled
  });

  // Apply transform styles
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Direction is determined by comparing y positions
  React.useEffect(() => {
    if (isOverDropTarget) {
      // Direction is determined by transform, positive y means downward
      const direction = transform?.y && transform.y > 0 
        ? DIRECTIONS.DOWNWARD 
        : DIRECTIONS.UPWARD;
      setDragDirection(direction);
    }
  }, [transform, isOverDropTarget, setDragDirection]);

  // On selection change hide drag handle
  React.useEffect(() => {
    setDragVisibility('hidden');
  }, [editor.selection]);

  return (
    <Wrapper 
      ref={setNodeRef} 
      style={style} 
      $isOverDropTarget={isOverDropTarget}
    >
      {isOverDropTarget && (
        <DropPlaceholder
          borderStyle="solid"
          borderColor="secondary200"
          borderWidth="2px"
          width="calc(100% - 24px)"
          marginLeft="auto"
          $dragDirection={dragDirection}
          // For list items placeholder reduce the margin around
          $placeholderMargin={children.props.as && children.props.as === 'li' ? 1 : 2}
        />
      )}
      {isDragging ? (
        <CloneDragItem dragHandleTopMargin={dragHandleTopMargin}>{children}</CloneDragItem>
      ) : (
        <DragItem
          gap={2}
          paddingLeft={2}
          alignItems="start"
          onMouseMove={() => setDragVisibility('visible')}
          onSelect={() => setDragVisibility('visible')}
          onMouseLeave={() => setDragVisibility('hidden')}
          aria-disabled={disabled}
          $dragVisibility={dragVisibility}
        >
          <DragIconButton
            tag="div"
            contentEditable={false}
            // role="button"
            // tabIndex={0}
            withTooltip={false}
            label={formatMessage({
              id: getTranslation('components.DragHandle-label'),
              defaultMessage: 'Drag',
            })}
            onClick={(e) => e.stopPropagation()}
            // aria-disabled={disabled}
            disabled={disabled}
            draggable
            // For some blocks top margin added to drag handle to align at the text level
            $dragHandleTopMargin={dragHandleTopMargin}
            // Add dnd-kit listeners and attributes to the drag handle
            {...attributes}
            {...listeners}
          >
            <Drag color="primary500" />
          </DragIconButton>
          {children}
        </DragItem>
      )}
    </Wrapper>
  );
};

interface CloneDragItemProps {
  children: RenderElementProps['children'];
  dragHandleTopMargin?: CSSProperties['marginTop'];
}

// To prevent applying opacity to the original item being dragged, display a cloned element without opacity.
const CloneDragItem = ({ children, dragHandleTopMargin }: CloneDragItemProps) => {
  const { formatMessage } = useIntl();

  return (
    <DragItem gap={2} paddingLeft={2} alignItems="start" $dragVisibility="visible">
      <DragIconButton
        tag="div"
        role="button"
        withTooltip={false}
        label={formatMessage({
          id: getTranslation('components.DragHandle-label'),
          defaultMessage: 'Drag',
        })}
        $dragHandleTopMargin={dragHandleTopMargin}
      >
        <Drag color="neutral600" />
      </DragIconButton>
      {children}
    </DragItem>
  );
};

interface ExtendedRenderLeafProps extends RenderLeafProps {
  leaf: RenderLeafProps['leaf'] & { className?: string };
}

const baseRenderLeaf = (props: ExtendedRenderLeafProps, modifiers: ModifiersStore) => {
  // Recursively wrap the children for each active modifier
  const wrappedChildren = getEntries(modifiers).reduce((currentChildren, modifierEntry) => {
    const [name, modifier] = modifierEntry;

    if (props.leaf[name]) {
      const modifierWithRenderLeaf = modifier as { renderLeaf: (children: React.ReactNode) => React.ReactNode };

      return modifierWithRenderLeaf.renderLeaf(currentChildren);
    }

    return currentChildren;
  }, props.children);

  return (
    <span {...props.attributes} className={props.leaf.className}>
      {wrappedChildren}
    </span>
  );
};

type BaseRenderElementProps = Direction & {
  props: RenderElementProps['children'];
  blocks: BlocksStore;
  editor: Editor;
};

const baseRenderElement = ({
  props,
  blocks,
  editor,
  setDragDirection,
  dragDirection,
}: BaseRenderElementProps) => {
  const { element } = props;

  const blockMatch = Object.values(blocks).find((block) => block.matchNode(element));
  const block = blockMatch || blocks.paragraph;
  const nodePath = ReactEditor.findPath(editor as ReactEditor, element);

  // Link is inline block so it cannot be dragged
  // List items and nested list blocks i.e. lists with indent level higher than 0 are skipped from dragged items
  if (
    isLinkNode(element) ||
    (isListNode(element) && element.indentLevel && element.indentLevel > 0) ||
    element.type === 'list-item'
  ) {
    return block.renderElement(props);
  }

  return (
    <SortableDragAndDropElement
      index={nodePath}
      setDragDirection={setDragDirection}
      dragDirection={dragDirection}
      dragHandleTopMargin={block.dragHandleTopMargin}
    >
      {block.renderElement(props)}
    </SortableDragAndDropElement>
  );
};

interface BlocksContentProps {
  placeholder?: string;
  ariaLabelId: string;
}

const handleMoveBlocks = (editor: Editor, event: React.KeyboardEvent<HTMLElement>) => {
  if (!editor.selection) return;

  const start = Range.start(editor.selection);
  const currentIndex = [start.path[0]];
  let newIndexPosition = 0;

  if (event.key === 'ArrowUp') {
    newIndexPosition = currentIndex[0] > 0 ? currentIndex[0] - 1 : currentIndex[0];
  } else {
    newIndexPosition =
      currentIndex[0] < editor.children.length - 1 ? currentIndex[0] + 1 : currentIndex[0];
  }

  const newIndex = [newIndexPosition];

  if (newIndexPosition !== currentIndex[0]) {
    Transforms.moveNodes(editor, {
      at: currentIndex,
      to: newIndex,
    });

    // Use function arguments instead of accessing scope variables
    return { currentIndex, newIndex };
  }
  return null;
}

const BlocksContent = ({ placeholder, ariaLabelId }: BlocksContentProps) => {
  const { editor, disabled, blocks, modifiers, setLiveText, isExpandedMode } =
    useBlocksEditorContext('BlocksContent');
  const blocksRef = React.useRef<HTMLDivElement>(null);
  const { formatMessage } = useIntl();
  const [dragDirection, setDragDirection] = React.useState<DragDirection | null>(null);
  const { modalElement, handleConversionResult } = useConversionModal();

  // Set up sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before drag starts
      },
    }),
    useSensor(TouchSensor)
  );

  // Handle dragging end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIndex = Number(active.id);
    const overIndex = Number(over.id);

    if (activeIndex !== overIndex) {
      // Move nodes in the editor
      Transforms.moveNodes(editor, {
        at: [activeIndex],
        to: [overIndex],
      });

      // Add liveText announcement
      setLiveText(
        formatMessage(
          {
            id: getTranslation('components.Blocks.dnd.reorder'),
            defaultMessage: '{item}, moved. New position in the editor: {position}.',
          },
          {
            item: `${activeIndex + 1}`,
            position: `${overIndex + 1} of ${editor.children.length}`,
          }
        )
      );
    }
  };

  // Create renderLeaf function based on the modifiers store
  const renderLeaf = React.useCallback(
    (props: ExtendedRenderLeafProps) => baseRenderLeaf(props, modifiers),
    [modifiers]
  );

  // Create renderElement function base on the blocks store
  const renderElement = React.useCallback(
    (props: RenderElementProps) =>
      baseRenderElement({ props, blocks, editor, dragDirection, setDragDirection }),
    [blocks, editor, dragDirection, setDragDirection]
  );

  const checkSnippet = (event: React.KeyboardEvent<HTMLElement>) => {
    // Get current text block
    if (!editor.selection) {
      return;
    }

    const [textNode, textNodePath] = Editor.node(editor, editor.selection.anchor.path);

    // Narrow the type to a text node
    if (Editor.isEditor(textNode) || 'type' in textNode && textNode.type !== 'text') {
      return;
    }

    // Don't check for snippets if we're not at the start of a block
    if (textNodePath.at(-1) !== 0) {
      return;
    }

    // Narrow the type to a text node
    if (Editor.isEditor(textNode) || 'type' in textNode && textNode.type !== 'text') {
      return;
    }

    // Check if the text node starts with a known snippet
    const blockMatchingSnippet = Object.values(blocks).find((block) => {
      return block.snippets?.includes((textNode as CustomText).text);
    });

    if (blockMatchingSnippet?.handleConvert) {
      // Prevent the space from being created and delete the snippet
      event.preventDefault();
      Transforms.delete(editor, {
        distance: (textNode as CustomText).text.length,
        unit: 'character',
        reverse: true,
      });

      // Convert the selected block
      const maybeRenderModal = blockMatchingSnippet.handleConvert(editor);
      handleConversionResult(maybeRenderModal);
    }
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!editor.selection) {
      return;
    }

    const selectedNode = editor.children[editor.selection.anchor.path[0]];
    const selectedBlock = Object.values(blocks).find((block) => block.matchNode(selectedNode as never));
    if (!selectedBlock) {
      return;
    }

    // Allow forced line breaks when shift is pressed
    if (event.shiftKey && (selectedNode as CustomElement).type !== 'image') {
      Transforms.insertText(editor, '\n');
      return;
    }

    // Check if there's an enter handler for the selected block
    if (selectedBlock.handleEnterKey) {
      selectedBlock.handleEnterKey(editor);
    } else {
      blocks.paragraph.handleEnterKey!(editor);
    }
  };

  const handleBackspaceEvent = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!editor.selection) {
      return;
    }

    const selectedNode = editor.children[editor.selection.anchor.path[0]];
    const selectedBlock = Object.values(blocks).find((block) => block.matchNode(selectedNode as never));

    if (!selectedBlock) {
      return;
    }

    if (selectedBlock.handleBackspaceKey) {
      selectedBlock.handleBackspaceKey(editor, event);
    }
  };

  const handleTab = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!editor.selection) {
      return;
    }

    const selectedNode = editor.children[editor.selection.anchor.path[0]];
    const selectedBlock = Object.values(blocks).find((block) => block.matchNode(selectedNode as never));
    if (!selectedBlock) {
      return;
    }

    if (selectedBlock.handleTab) {
      event.preventDefault();
      selectedBlock.handleTab(editor);
    }
  };

  const handleKeyboardShortcuts = (event: React.KeyboardEvent<HTMLElement>) => {
    const isCtrlOrCmd = event.metaKey || event.ctrlKey;

    if (isCtrlOrCmd) {
      // Check if there's a modifier to toggle
      Object.values(modifiers).forEach((value) => {
        const modifier = value as { isValidEventKey: (event: React.KeyboardEvent<HTMLElement>) => boolean; handleToggle: (editor: Editor) => void };

        if (modifier.isValidEventKey(event)) {
          modifier.handleToggle(editor);
          return;
        }
      });

      if (event.shiftKey && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
        const result = handleMoveBlocks(editor, event);
        if (result) {
          const { currentIndex, newIndex } = result;
          setLiveText(
            formatMessage(
              {
                id: getTranslation('components.Blocks.dnd.reorder'),
                defaultMessage: '{item}, moved. New position in the editor: {position}.',
              },
              {
                item: `block.${currentIndex[0] + 1}`,
                position: `${newIndex[0] + 1} of ${editor.children.length}`,
              }
            )
          );
          event.preventDefault();
        }
      }
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    // Find the right block-specific handlers for enter and backspace key presses
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        return handleEnter(event);
      case 'Backspace':
        return handleBackspaceEvent(event);
      case 'Tab':
        return handleTab(event);
      case 'Escape':
        return ReactEditor.blur(editor as ReactEditor);
    }

    handleKeyboardShortcuts(event);

    // Check if a snippet was triggered
    if (event.key === ' ') {
      checkSnippet(event);
    }
  };

  /**
   *  scrollSelectionIntoView : Slate's default method to scroll a DOM selection into the view,
   *  thats shifting layout for us when there is a overflowY:scroll on the viewport.
   *  We are overriding it to check if the selection is not fully within the visible area of the editor,
   *  we use scrollBy one line to the bottom
   */
  const handleScrollSelectionIntoView = () => {
    if (!editor.selection) return;
    const domRange = ReactEditor.toDOMRange(editor as ReactEditor, editor.selection);
    const domRect = domRange.getBoundingClientRect();
    const blocksInput = blocksRef.current;

    if (!blocksInput) {
      return;
    }

    const editorRect = blocksInput.getBoundingClientRect();

    // Check if the selection is not fully within the visible area of the editor
    if (domRect.top < editorRect.top || domRect.bottom > editorRect.bottom) {
      // Scroll by one line to the bottom
      blocksInput.scrollBy({
        top: 28, // 20px is the line-height + 8px line gap
        behavior: 'smooth',
      });
    }
  };

  // Get sortable items from editor children
  const sortableItems = React.useMemo(() => 
    editor.children.map((_, index) => ({ id: String(index) }))
  , [editor.children.length]);

  return (
    <Box
      ref={blocksRef}
      grow={1}
      width="100%"
      overflow="auto"
      fontSize={2}
      background="neutral0"
      color="neutral800"
      lineHeight={6}
      paddingRight={7}
      paddingTop={6}
      paddingBottom={3}
    >
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={sortableItems}
          strategy={verticalListSortingStrategy}
        >
          <StyledEditable
            aria-labelledby={ariaLabelId}
            readOnly={disabled}
            placeholder={placeholder}
            $isExpandedMode={isExpandedMode}
            decorate={decorateCode}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={handleKeyDown}
            scrollSelectionIntoView={handleScrollSelectionIntoView}
            // Let the DndContext handle drag and drop
            onDrop={() => true}
            onDragStart={() => true}
          />
        </SortableContext>
      </DndContext>
      {modalElement}
    </Box>
  );
};

export { BlocksContent, BlocksContentProps };
