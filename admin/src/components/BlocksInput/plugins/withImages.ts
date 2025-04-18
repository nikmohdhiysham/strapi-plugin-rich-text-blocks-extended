import { type Editor, type BaseElement } from 'slate';
import { CustomElement } from '../utils/types';

/**
 * Images are void elements. They handle the rendering of their children instead of Slate.
 * See the Slate documentation for more information:
 * - https://docs.slatejs.org/api/nodes/element#void-vs-not-void
 * - https://docs.slatejs.org/api/nodes/element#rendering-void-elements
 */
const withImages = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element: BaseElement) => {
    return 'type' in element && element.type === 'image' ? true : isVoid(element);
  };

  return editor;
};

export { withImages };