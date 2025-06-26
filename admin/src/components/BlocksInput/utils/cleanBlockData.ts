import { Descendant, Element } from 'slate';
import { CustomElement } from './types';

/**
 * Clean up node data by removing irrelevant properties based on node type
 * This function creates a deep copy and doesn't modify the original data
 */
export const cleanBlockData = (nodes: Descendant[]): Descendant[] => {
  return nodes.map(node => cleanNode(node));
};

const cleanNode = (node: Descendant): Descendant => {
  if (!Element.isElement(node)) {
    return { ...node };
  }

  const element = node as CustomElement;
  const cleanedElement: any = { ...element };

  // Clean up based on node type
  switch (element.type) {
    case 'separator':
      // Remove font-related properties from separator
      delete cleanedElement.fontFamily;
      delete cleanedElement.fontColor;
      delete cleanedElement.fontSettings;
      break;
    
    case 'image':
    case 'code':
      // Remove all font and separator properties from image and code blocks
      delete cleanedElement.fontFamily;
      delete cleanedElement.fontColor;
      delete cleanedElement.fontSettings;
      delete cleanedElement.separatorStyle;
      delete cleanedElement.separatorColor;
      delete cleanedElement.separatorSettings;
      delete cleanedElement.separatorSize;
      delete cleanedElement.separatorOrientation;
      break;
      
    default:
      // For text blocks, remove separator properties
      delete cleanedElement.separatorStyle;
      delete cleanedElement.separatorColor;
      delete cleanedElement.separatorSettings;
      delete cleanedElement.separatorSize;
      delete cleanedElement.separatorOrientation;
      break;
  }

  // Recursively clean children
  if (cleanedElement.children && Array.isArray(cleanedElement.children)) {
    cleanedElement.children = cleanedElement.children.map((child: Descendant) => cleanNode(child));
  }

  return cleanedElement;
};