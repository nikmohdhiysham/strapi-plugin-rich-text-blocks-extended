import { type Path, Editor, Transforms } from 'slate';
import { CustomElement } from './types';

/**
 * Extracts some logic that is common to most blocks' handleConvert functions.
 * @returns The path of the converted block
 */
const baseHandleConvert = <T extends CustomElement>(
  editor: Editor,
  attributesToSet: Partial<T> & { type: T['type'] }
): void | Path => {
  // If there is no selection, convert last inserted node
  const [_, lastNodePath] = Editor.last(editor, []);

  // If the selection is inside a list, split the list so that the modified block is outside of it
  Transforms.unwrapNodes(editor, {
    match: (node): node is CustomElement => 
      !Editor.isEditor(node) && 
      'type' in node && 
      node.type === 'list',
    split: true,
    at: editor.selection ?? lastNodePath,
  });

  // Make sure we get a block node, not an inline node
  const [, updatedLastNodePath] = Editor.last(editor, []);
  const entry = Editor.above(editor, {
    match: (node): node is CustomElement => 
      !Editor.isEditor(node) && 
      'type' in node && 
      node.type !== 'text' && 
      node.type !== 'link',
    at: editor.selection ?? updatedLastNodePath,
  });

  if (!entry || Editor.isEditor(entry[0])) {
    return;
  }

  const [element, elementPath] = entry;

  Transforms.setNodes<CustomElement>(
    editor,
    {
      ...getAttributesToClear(element),
      ...attributesToSet,
    },
    { at: elementPath }
  );

  return elementPath;
};

/**
 * Set all attributes except type and children to null so that Slate deletes them
 */
const getAttributesToClear = (element: CustomElement) => {
  const { children: _children, type: _type, ...extra } = element;

  const attributesToClear = Object.keys(extra).reduce(
    (currentAttributes, key) => ({ ...currentAttributes, [key]: null }),
    {}
  );

  return attributesToClear as Record<string, null>;
};

export { baseHandleConvert, getAttributesToClear };