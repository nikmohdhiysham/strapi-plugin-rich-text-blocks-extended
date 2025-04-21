import React, { useState, useEffect } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import {
  Box,
  Flex,
  SingleSelect,
  SingleSelectOption,
  Popover,
  IconButton,
  Tooltip
} from '@strapi/design-system';
import { Editor, Transforms, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { styled } from 'styled-components';
import { Cog } from '@strapi/icons';

// Import icon components from FontSettingsIcons
import { FontSizeIcon, FontLeadingIcon, FontAlignmentIcon, FontViewportIcon } from './FontSettingsIcons';

import { useBlocksEditorContext } from './BlocksEditor';
import { FontSetting, CustomElement } from './utils/types';
import {
  FONT_FAMILY_OPTIONS,
  FONT_COLOR_OPTIONS,
  FONT_SIZE_OPTIONS,
  FONT_LEADING_OPTIONS,
  FONT_ALIGNMENT_OPTIONS,
  VIEWPORT_OPTIONS
} from './utils/styleConstants';

// Get default values (first item in each options array)
const DEFAULT_FONT_FAMILY = FONT_FAMILY_OPTIONS[0].value;
const DEFAULT_FONT_COLOR = FONT_COLOR_OPTIONS[0].value;
const DEFAULT_FONT_SIZE = FONT_SIZE_OPTIONS[0].value;
const DEFAULT_FONT_LEADING = FONT_LEADING_OPTIONS[0].value;
const DEFAULT_FONT_ALIGNMENT = FONT_ALIGNMENT_OPTIONS[0].value;
const DEFAULT_VIEWPORT = VIEWPORT_OPTIONS[0].value;

export const ToolbarSeparator = styled(Toolbar.Separator)`
  background: ${({ theme }) => theme.colors.neutral150};
  width: 1px;
  height: 2.4rem;
`;

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

// Make the whole selector clickable
const ColorSelectWrapper = styled(SelectWrapper)`
  div[role='combobox'] {
    pointer-events: all;
    
    > span:first-child {
      cursor: pointer;
      width: 100%;
    }
  }
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  background-color: ${props => props.color};
  border: 1px solid white;
  border-radius: 3px;
  display: inline-block;
  margin-right: 8px;
`;

const SettingGroup = styled(Flex)`
  align-items: center;
  margin-bottom: 12px;
  justify-content: flex-start;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingIcon = styled(Box)`
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  color: ${({ theme }) => theme.colors.neutral600};
`;

const StyleToolbar = () => {
  const { editor, disabled } = useBlocksEditorContext('StyleToolbar');
  const [selectedNode, setSelectedNode] = useState<CustomElement | null>(null);
  const [currentPath, setCurrentPath] = useState<any[]>([]);
  const [fontFamily, setFontFamily] = useState<string | null>(null);
  const [fontColor, setFontColor] = useState<string | null>(null);
  const [selectedViewport, setSelectedViewport] = useState<string>('mobile');
  const [fontSize, setFontSize] = useState<string | null>(null);
  const [fontLeading, setFontLeading] = useState<string | null>(null);
  const [fontAlignment, setFontAlignment] = useState<string | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
      
      // Find the current font size, leading, and alignment for the selected viewport
      if (typedNode.fontSettings) {
        const fontSetting = typedNode.fontSettings.find(
          (setting: FontSetting) => setting.breakpoint === selectedViewport
        );
        if (fontSetting) {
          setFontSize(fontSetting.fontSize || DEFAULT_FONT_SIZE);
          setFontLeading(fontSetting.fontLeading || DEFAULT_FONT_LEADING);
          setFontAlignment(fontSetting.fontAlignment || DEFAULT_FONT_ALIGNMENT);
        } else {
          setFontSize(DEFAULT_FONT_SIZE);
          setFontLeading(DEFAULT_FONT_LEADING);
          setFontAlignment(DEFAULT_FONT_ALIGNMENT);
        }
      } else {
        setFontSize(DEFAULT_FONT_SIZE);
        setFontLeading(DEFAULT_FONT_LEADING);
        setFontAlignment(DEFAULT_FONT_ALIGNMENT);
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
          fontLeading: DEFAULT_FONT_LEADING,
          fontAlignment: DEFAULT_FONT_ALIGNMENT
        },
        {
          breakpoint: 'tablet',
          fontSize: DEFAULT_FONT_SIZE,
          fontLeading: DEFAULT_FONT_LEADING,
          fontAlignment: DEFAULT_FONT_ALIGNMENT
        },
        {
          breakpoint: 'desktop',
          fontSize: DEFAULT_FONT_SIZE,
          fontLeading: DEFAULT_FONT_LEADING,
          fontAlignment: DEFAULT_FONT_ALIGNMENT
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
    
    // Update the font settings to match the selected viewport
    if (selectedNode && selectedNode.fontSettings) {
      const fontSetting = selectedNode.fontSettings.find(
        (setting: FontSetting) => setting.breakpoint === stringValue
      );
      if (fontSetting) {
        setFontSize(fontSetting.fontSize || DEFAULT_FONT_SIZE);
        setFontLeading(fontSetting.fontLeading || DEFAULT_FONT_LEADING);
        setFontAlignment(fontSetting.fontAlignment || DEFAULT_FONT_ALIGNMENT);
      } else {
        setFontSize(DEFAULT_FONT_SIZE);
        setFontLeading(DEFAULT_FONT_LEADING);
        setFontAlignment(DEFAULT_FONT_ALIGNMENT);
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
          fontLeading: fontLeading || DEFAULT_FONT_LEADING,
          fontAlignment: fontAlignment || DEFAULT_FONT_ALIGNMENT
        });
      }
    } else {
      // Create new settings array with the current setting
      newFontSettings = [{
        breakpoint: selectedViewport as 'mobile' | 'tablet' | 'desktop',
        fontSize: stringValue,
        fontLeading: fontLeading || DEFAULT_FONT_LEADING,
        fontAlignment: fontAlignment || DEFAULT_FONT_ALIGNMENT
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
          fontLeading: stringValue,
          fontAlignment: fontAlignment || DEFAULT_FONT_ALIGNMENT
        });
      }
    } else {
      // Create new settings array with the current setting
      newFontSettings = [{
        breakpoint: selectedViewport as 'mobile' | 'tablet' | 'desktop',
        fontSize: fontSize || DEFAULT_FONT_SIZE,
        fontLeading: stringValue,
        fontAlignment: fontAlignment || DEFAULT_FONT_ALIGNMENT
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

  // Handle font alignment change
  const handleFontAlignmentChange = (value: string | number) => {
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
          fontAlignment: stringValue
        };
      } else {
        newFontSettings.push({
          breakpoint: selectedViewport as 'mobile' | 'tablet' | 'desktop',
          fontSize: fontSize || DEFAULT_FONT_SIZE,
          fontLeading: fontLeading || DEFAULT_FONT_LEADING,
          fontAlignment: stringValue
        });
      }
    } else {
      // Create new settings array with the current setting
      newFontSettings = [{
        breakpoint: selectedViewport as 'mobile' | 'tablet' | 'desktop',
        fontSize: fontSize || DEFAULT_FONT_SIZE,
        fontLeading: fontLeading || DEFAULT_FONT_LEADING,
        fontAlignment: stringValue
      }];
    }
    
    Transforms.setNodes(
      editor,
      { fontSettings: newFontSettings } as Partial<Node>,
      { at: currentPath }
    );
    
    setFontAlignment(stringValue);
    ReactEditor.focus(editor as ReactEditor);
  };

  if (!selectedNode) {
    return null;
  }

  const showStyleOptions = !['image', 'code'].includes(selectedNode.type) || !selectedNode?.type;

  return (
    <>
      <Flex gap={2}>
        {/* Font Family Selector */}
        {showStyleOptions && (
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
        )}

        {/* Font Color Selector */}
        {showStyleOptions && (
          <ColorSelectWrapper>
            <SingleSelect
              placeholder="Color"
              onChange={handleFontColorChange}
              value={fontColor || DEFAULT_FONT_COLOR}
              disabled={disabled}
              aria-label="Select font color"
            >
              {FONT_COLOR_OPTIONS.map((option) => (
                <SingleSelectOption key={option.value} value={option.value}>
                  <Flex alignItems="center" pointerEvents="none">
                    <ColorSwatch color={option.value} />
                    <span>{option.label}</span>
                  </Flex>
                </SingleSelectOption>
              ))}
            </SingleSelect>
          </ColorSelectWrapper>
        )}

        {/* Advanced Settings Popover (Viewport, Font Size, Leading, Alignment) */}
        {showStyleOptions && (
          <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <Popover.Trigger>
              <IconButton label="Advanced text settings" variant='ghost'>
                <Cog />
              </IconButton>
            </Popover.Trigger>
            <Popover.Content style={{ minWidth: '180px', padding: '12px' }}>
              <Flex direction="column" gap={2} alignItems="flex-start">
                {/* Viewport Setting */}
                <SettingGroup>
                  <Tooltip label="Viewport">
                    <SettingIcon>
                      <FontViewportIcon />
                    </SettingIcon>
                  </Tooltip>
                  <Box flex="1" style={{ width: '100%' }}>
                    <SingleSelect
                      placeholder="Viewport"
                      onChange={handleViewportChange}
                      value={selectedViewport || DEFAULT_VIEWPORT}
                      disabled={disabled}
                      aria-label="Select viewport"
                      size="S"
                    >
                      {VIEWPORT_OPTIONS.map((option) => (
                        <SingleSelectOption key={option.value} value={option.value}>
                          {option.label}
                        </SingleSelectOption>
                      ))}
                    </SingleSelect>
                  </Box>
                </SettingGroup>

                {/* Font Size Setting */}
                <SettingGroup>
                  <Tooltip label="Font Size">
                    <SettingIcon>
                      <FontSizeIcon />
                    </SettingIcon>
                  </Tooltip>
                  <Box flex="1" style={{ width: '100%' }}>
                    <SingleSelect
                      placeholder="Font Size"
                      onChange={handleFontSizeChange}
                      value={fontSize || DEFAULT_FONT_SIZE}
                      disabled={disabled}
                      aria-label="Select font size"
                      size="S"
                    >
                      {FONT_SIZE_OPTIONS.map((option) => (
                        <SingleSelectOption key={option.value} value={option.value}>
                          {option.label}
                        </SingleSelectOption>
                      ))}
                    </SingleSelect>
                  </Box>
                </SettingGroup>

                {/* Line Height Setting */}
                <SettingGroup>
                  <Tooltip label="Line Height">
                    <SettingIcon>
                      <FontLeadingIcon />
                    </SettingIcon>
                  </Tooltip>
                  <Box flex="1" style={{ width: '100%' }}>
                    <SingleSelect
                      placeholder="Line Height"
                      onChange={handleFontLeadingChange}
                      value={fontLeading || DEFAULT_FONT_LEADING}
                      disabled={disabled}
                      aria-label="Select line height"
                      size="S"
                    >
                      {FONT_LEADING_OPTIONS.map((option) => (
                        <SingleSelectOption key={option.value} value={option.value}>
                          {option.label}
                        </SingleSelectOption>
                      ))}
                    </SingleSelect>
                  </Box>
                </SettingGroup>

                {/* Text Alignment Setting */}
                <SettingGroup>
                  <Tooltip label="Text Alignment">
                    <SettingIcon>
                      <FontAlignmentIcon />
                    </SettingIcon>
                  </Tooltip>
                  <Box flex="1" style={{ width: '100%' }}>
                    <SingleSelect
                      placeholder="Alignment"
                      onChange={handleFontAlignmentChange}
                      value={fontAlignment || DEFAULT_FONT_ALIGNMENT}
                      disabled={disabled}
                      aria-label="Select text alignment"
                      size="S"
                    >
                      {FONT_ALIGNMENT_OPTIONS.map((option) => (
                        <SingleSelectOption key={option.value} value={option.value}>
                          {option.label}
                        </SingleSelectOption>
                      ))}
                    </SingleSelect>
                  </Box>
                </SettingGroup>
              </Flex>
            </Popover.Content>
          </Popover.Root>
        )}
      </Flex>
      {showStyleOptions && (
        <ToolbarSeparator />
      )}
    </>
  );
};

export default StyleToolbar; 