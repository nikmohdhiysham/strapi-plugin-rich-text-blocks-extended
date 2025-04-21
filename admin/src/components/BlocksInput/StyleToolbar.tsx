import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  SingleSelect,
  SingleSelectOption,
  Typography,
  Popover
} from '@strapi/design-system';
import { Editor, Transforms, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { styled } from 'styled-components';

import { useBlocksEditorContext } from './BlocksEditor';
import { FontSetting, CustomElement } from './utils/types';
import {
  FONT_FAMILY_OPTIONS,
  FONT_COLOR_OPTIONS,
  FONT_SIZE_OPTIONS,
  FONT_LEADING_OPTIONS,
  VIEWPORT_OPTIONS
} from './utils/styleConstants';

// Get default values (first item in each options array)
const DEFAULT_FONT_FAMILY = FONT_FAMILY_OPTIONS[0].value;
const DEFAULT_FONT_COLOR = FONT_COLOR_OPTIONS[0].value;
const DEFAULT_FONT_SIZE = FONT_SIZE_OPTIONS[0].value;
const DEFAULT_FONT_LEADING = FONT_LEADING_OPTIONS[0].value;
const DEFAULT_VIEWPORT = VIEWPORT_OPTIONS[0].value;

const SelectWrapper = styled(Box)`
  div[role='combobox'] {
    border: none;
    cursor: pointer;
    min-height: unset;
    padding-top: 6px;
    padding-bottom: 6px;

    &[aria-disabled='false']:hover {
      cursor: pointer;
      background: ${({ theme }) => theme.colors.primary100};
    }

    &[aria-disabled] {
      background: transparent;
      cursor: inherit;

      span {
        color: ${({ theme }) => theme.colors.neutral600};
      }
    }
  }
`;

const StyleToolbar = () => {
  const { editor, disabled } = useBlocksEditorContext('StyleToolbar');
  const [selectedNode, setSelectedNode] = useState<CustomElement | null>(null);
  const [currentPath, setCurrentPath] = useState<any[]>([]);
  const [fontFamily, setFontFamily] = useState<string | null>(null);
  const [fontColor, setFontColor] = useState<string | null>(null);
  const [selectedViewport, setSelectedViewport] = useState<string>('desktop');
  const [fontSize, setFontSize] = useState<string | null>(null);
  const [fontLeading, setFontLeading] = useState<string | null>(null);

  // Get the currently selected node
  useEffect(() => {
    if (!editor.selection) {
      setSelectedNode(null);
      return;
    }

    const entry = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && 'type' in n,
    });

    if (entry) {
      const [node, path] = entry;
      const typedNode = node as CustomElement;
      
      setSelectedNode(typedNode);
      setCurrentPath(path);
      
      // Set values based on the selected node or use defaults
      setFontFamily(typedNode.fontFamily || DEFAULT_FONT_FAMILY);
      setFontColor(typedNode.fontColor || DEFAULT_FONT_COLOR);
      
      // Find the current font size and leading for the selected viewport
      if (typedNode.fontSettings) {
        const fontSetting = typedNode.fontSettings.find(
          (setting: FontSetting) => setting.breakpoint === selectedViewport
        );
        if (fontSetting) {
          // Parse the fontSize to extract size and leading values
          setFontSize(fontSetting.fontSize || DEFAULT_FONT_SIZE);
          setFontLeading(fontSetting.fontLeading || DEFAULT_FONT_LEADING);
        } else {
          setFontSize(DEFAULT_FONT_SIZE);
          setFontLeading(DEFAULT_FONT_LEADING);
        }
      } else {
        setFontSize(DEFAULT_FONT_SIZE);
        setFontLeading(DEFAULT_FONT_LEADING);
      }
      
      // Apply defaults if this is the first time selecting this node
      if (!typedNode.fontFamily || !typedNode.fontColor || !typedNode.fontSettings) {
        applyDefaultStyles(typedNode, path);
      }
    } else {
      setSelectedNode(null);
    }
  }, [editor.selection, selectedViewport, editor]);
  
  // Apply default styles to a node if it doesn't have them already
  const applyDefaultStyles = (node: CustomElement, path: any[]) => {
    // Build the changes object based on what's missing
    const changes: Partial<CustomElement> = {};
    
    if (!node.fontFamily) {
      changes.fontFamily = DEFAULT_FONT_FAMILY;
    }
    
    if (!node.fontColor) {
      changes.fontColor = DEFAULT_FONT_COLOR;
    }
    
    // Create default font settings if missing
    if (!node.fontSettings || node.fontSettings.length === 0) {
      changes.fontSettings = [
        {
          breakpoint: 'mobile',
          fontSize: DEFAULT_FONT_SIZE, 
          fontLeading: DEFAULT_FONT_LEADING
        },
        {
          breakpoint: 'tablet',
          fontSize: DEFAULT_FONT_SIZE,
          fontLeading: DEFAULT_FONT_LEADING
        },
        {
          breakpoint: 'desktop',
          fontSize: DEFAULT_FONT_SIZE,
          fontLeading: DEFAULT_FONT_LEADING
        }
      ];
    }
    
    // Only apply changes if there are any
    if (Object.keys(changes).length > 0) {
      Transforms.setNodes(
        editor,
        changes as Partial<Node>,
        { at: path }
      );
    }
  };

  // Handle font family change
  const handleFontFamilyChange = (value: string | number) => {
    if (!selectedNode || !currentPath.length) return;
    
    const stringValue = String(value);
    
    Transforms.setNodes(
      editor,
      { fontFamily: stringValue } as Partial<Node>,
      { at: currentPath }
    );
    
    setFontFamily(stringValue);
    ReactEditor.focus(editor as ReactEditor);
  };

  // Handle font color change
  const handleFontColorChange = (value: string | number) => {
    if (!selectedNode || !currentPath.length) return;
    
    const stringValue = String(value);
    
    Transforms.setNodes(
      editor,
      { fontColor: stringValue } as Partial<Node>,
      { at: currentPath }
    );
    
    setFontColor(stringValue);
    ReactEditor.focus(editor as ReactEditor);
  };

  // Handle viewport change
  const handleViewportChange = (value: string | number) => {
    const stringValue = String(value);
    setSelectedViewport(stringValue);
    
    // Update the font size to match the selected viewport
    if (selectedNode && selectedNode.fontSettings) {
      const fontSetting = selectedNode.fontSettings.find(
        (setting: FontSetting) => setting.breakpoint === stringValue
      );
      if (fontSetting) {
        setFontSize(fontSetting.fontSize || DEFAULT_FONT_SIZE);
        setFontLeading(fontSetting.fontLeading || DEFAULT_FONT_LEADING);
      } else {
        setFontSize(DEFAULT_FONT_SIZE);
        setFontLeading(DEFAULT_FONT_LEADING);
      }
    }
    
    ReactEditor.focus(editor as ReactEditor);
  };

  // Handle font size change
  const handleFontSizeChange = (value: string | number) => {
    if (!selectedNode || !currentPath.length) return;
    
    const stringValue = String(value);
    
    // Create or update fontSettings for the current viewport
    let newFontSettings: FontSetting[] = [];
    
    if (selectedNode.fontSettings) {
      // Clone existing settings
      newFontSettings = [...selectedNode.fontSettings];
      
      // Find and update the setting for the current viewport, or add a new one
      const existingSettingIndex = newFontSettings.findIndex(
        (setting: FontSetting) => setting.breakpoint === selectedViewport
      );
      
      if (existingSettingIndex !== -1) {
        newFontSettings[existingSettingIndex] = {
          ...newFontSettings[existingSettingIndex],
          fontSize: stringValue
        };
      } else {
        newFontSettings.push({
          breakpoint: selectedViewport as 'mobile' | 'tablet' | 'desktop',
          fontSize: stringValue,
          fontLeading: fontLeading || DEFAULT_FONT_LEADING
        });
      }
    } else {
      // Create new settings array with the current setting
      newFontSettings = [{
        breakpoint: selectedViewport as 'mobile' | 'tablet' | 'desktop',
        fontSize: stringValue,
        fontLeading: fontLeading || DEFAULT_FONT_LEADING
      }];
    }
    
    Transforms.setNodes(
      editor,
      { fontSettings: newFontSettings } as Partial<Node>,
      { at: currentPath }
    );
    
    setFontSize(stringValue);
    ReactEditor.focus(editor as ReactEditor);
  };

  // Handle font leading change
  const handleFontLeadingChange = (value: string | number) => {
    if (!selectedNode || !currentPath.length) return;
    
    const stringValue = String(value);
    
    // Create or update fontSettings for the current viewport
    let newFontSettings: FontSetting[] = [];
    
    if (selectedNode.fontSettings) {
      // Clone existing settings
      newFontSettings = [...selectedNode.fontSettings];
      
      // Find and update the setting for the current viewport, or add a new one
      const existingSettingIndex = newFontSettings.findIndex(
        (setting: FontSetting) => setting.breakpoint === selectedViewport
      );
      
      if (existingSettingIndex !== -1) {
        newFontSettings[existingSettingIndex] = {
          ...newFontSettings[existingSettingIndex],
          fontLeading: stringValue
        };
      } else {
        newFontSettings.push({
          breakpoint: selectedViewport as 'mobile' | 'tablet' | 'desktop',
          fontSize: fontSize || DEFAULT_FONT_SIZE,
          fontLeading: stringValue
        });
      }
    } else {
      // Create new settings array with the current setting
      newFontSettings = [{
        breakpoint: selectedViewport as 'mobile' | 'tablet' | 'desktop',
        fontSize: fontSize || DEFAULT_FONT_SIZE,
        fontLeading: stringValue
      }];
    }
    
    Transforms.setNodes(
      editor,
      { fontSettings: newFontSettings } as Partial<Node>,
      { at: currentPath }
    );
    
    setFontLeading(stringValue);
    ReactEditor.focus(editor as ReactEditor);
  };

  if (!selectedNode) {
    return null;
  }

  return (
    <Flex gap={2}>
      {/* Font Family Selector */}
      <SelectWrapper>
        <SingleSelect
          placeholder="Font Family"
          onChange={handleFontFamilyChange}
          value={fontFamily || DEFAULT_FONT_FAMILY}
          disabled={disabled}
          aria-label="Select font family"
        >
          {FONT_FAMILY_OPTIONS.map((option) => (
            <SingleSelectOption key={option.value} value={option.value}>
              {option.label}
            </SingleSelectOption>
          ))}
        </SingleSelect>
      </SelectWrapper>

      {/* Font Color Selector */}
      <SelectWrapper>
        <SingleSelect
          placeholder="Color"
          onChange={handleFontColorChange}
          value={fontColor || DEFAULT_FONT_COLOR}
          disabled={disabled}
          aria-label="Select font color"
        >
          {FONT_COLOR_OPTIONS.map((option) => (
            <SingleSelectOption key={option.value} value={option.value}>
              {option.label}
            </SingleSelectOption>
          ))}
        </SingleSelect>
      </SelectWrapper>

      {/* Viewport Selector */}
      <SelectWrapper>
        <SingleSelect
          placeholder="Viewport"
          onChange={handleViewportChange}
          value={selectedViewport || DEFAULT_VIEWPORT}
          disabled={disabled}
          aria-label="Select viewport"
        >
          {VIEWPORT_OPTIONS.map((option) => (
            <SingleSelectOption key={option.value} value={option.value}>
              {option.label}
            </SingleSelectOption>
          ))}
        </SingleSelect>
      </SelectWrapper>

      {/* Font Size Selector - Only available for paragraph and heading blocks */}
      {(selectedNode.type === 'heading' || selectedNode.type === 'paragraph') && (
        <SelectWrapper>
          <SingleSelect
            placeholder="Font Size"
            onChange={handleFontSizeChange}
            value={fontSize || DEFAULT_FONT_SIZE}
            disabled={disabled}
            aria-label="Select font size"
          >
            {FONT_SIZE_OPTIONS.map((option) => (
              <SingleSelectOption key={option.value} value={option.value}>
                {option.label}
              </SingleSelectOption>
            ))}
          </SingleSelect>
        </SelectWrapper>
      )}

      {/* Font Leading Selector - Only available for paragraph and heading blocks */}
      {(selectedNode.type === 'heading' || selectedNode.type === 'paragraph') && (
        <SelectWrapper>
          <SingleSelect
            placeholder="Line Height"
            onChange={handleFontLeadingChange}
            value={fontLeading || DEFAULT_FONT_LEADING}
            disabled={disabled}
            aria-label="Select line height"
          >
            {FONT_LEADING_OPTIONS.map((option) => (
              <SingleSelectOption key={option.value} value={option.value}>
                {option.label}
              </SingleSelectOption>
            ))}
          </SingleSelect>
        </SelectWrapper>
      )}
    </Flex>
  );
};

export default StyleToolbar; 