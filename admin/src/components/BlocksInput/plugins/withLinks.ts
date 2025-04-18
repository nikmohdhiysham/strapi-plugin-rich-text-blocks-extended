import { 
  type BaseEditor, 
  Path, 
  Transforms, 
  Range, 
  Point, 
  Editor,
  type NodeEntry,
  type BaseElement
} from 'slate';
import { type ReactEditor } from 'slate-react';
import { insertLink } from '../utils/links';
import { CustomElement, CustomText } from '../utils/types';

// Define the LinkEditor interface
interface LinkEditor extends BaseEditor, ReactEditor {
  lastInsertedLinkPath: Path | null;
  shouldSaveLinkPath: boolean;
}

// Update the withLinks function to accept BaseEditor
const withLinks = (editor: BaseEditor) => {
  const linkEditor = editor as LinkEditor;
  const { isInline, apply, insertText } = linkEditor;

  // Initialize the custom properties
  linkEditor.lastInsertedLinkPath = null;
  linkEditor.shouldSaveLinkPath = true;

  // Links are inline elements
  linkEditor.isInline = (element: BaseElement) => {
    return 'type' in element && element.type === 'link' ? true : isInline(element);
  };

  // Rest of the implementation remains the same...
  linkEditor.apply = (operation) => {
    // ... existing apply implementation
  };

  linkEditor.insertText = (text) => {
    // ... existing insertText implementation
  };

  const { insertData } = linkEditor as unknown as { insertData: (data: DataTransfer) => void };
  linkEditor.insertData = (data: DataTransfer) => {
    // ... existing insertData implementation
  };

  return linkEditor;
};

export { withLinks, type LinkEditor };