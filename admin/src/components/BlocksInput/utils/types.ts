import type { BaseElement, BaseText, Node } from 'slate';

// Extend BaseElement to include type property
interface CustomElement extends BaseElement {
  type: string;
  [key: string]: unknown;
}

// Extend BaseText to include type property
interface CustomText extends BaseText {
  type: 'text';
  text: string;
}

// Define specific node types
interface LinkNode extends CustomElement {
  type: 'link';
  url: string;
  children: Node[];
}

interface ListNode extends CustomElement {
  type: 'list';
  format: 'ordered' | 'unordered';
  indentLevel: number;
  children: Node[];
}

interface HeadingElement extends CustomElement {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: CustomText[];
}

interface ImageElement extends CustomElement {
  type: 'image';
  image: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
    formats?: Record<string, any>;
    hash?: string;
    ext?: string;
    mime?: string;
    size?: number;
    previewUrl?: string;
  };
  children: CustomText[];
}

type Block<T extends string> = Extract<Node, { type: T }>;

// Wrap Object.entries to get the correct types
const getEntries = <T extends object>(object: T) =>
  Object.entries(object) as [keyof T, T[keyof T]][];

// Wrap Object.keys to get the correct types
const getKeys = <T extends object>(object: T) => Object.keys(object) as (keyof T)[];

const isLinkNode = (element: CustomElement): element is LinkNode => {
  return element.type === 'link';
};

const isListNode = (element: CustomElement): element is ListNode => {
  return element.type === 'list';
};

export { 
  type Block, 
  type CustomElement,
  type CustomText, 
  type HeadingElement,
  type ImageElement,
  type LinkNode,
  type ListNode,
  getEntries, 
  getKeys, 
  isLinkNode, 
  isListNode 
};