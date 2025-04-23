// REDUCE LAG WHEN TYPING - DONE, BUT STILL NEEDS TO BE IMPROVED
// FIX DEFAULTS - DONE
// ADD FONT TRACKING - DONE
// VALIDATE TYPED VALUES ARE NUMBERS - DONE
// ADD NEW OPTION TO SETTINGS OPTIONS IF ENTERED BY USER - DONE

// ADD UNITS FIELD IN PLUGIN CONFIG



import React, { useState, useEffect } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import {
  Box,
  Flex,
  SingleSelect,
  SingleSelectOption,
  Popover,
  IconButton,
  Tooltip,
} from '@strapi/design-system';
import { Editor, Transforms, Node, Element } from 'slate';
import { styled } from 'styled-components';
import { Cog } from '@strapi/icons';

import { FontViewportIcon } from './FontSettingsIcons';
import { useBlocksEditorContext } from './BlocksEditor';
import { CustomElement, FontSetting } from './utils/types';
import DynamicSettings from './DynamicSettings';
import {
  FONT_FAMILY_OPTIONS,
  FONT_COLOR_OPTIONS,
  FONT_SIZE_OPTIONS,
  FONT_LEADING_OPTIONS,
  FONT_TRACKING_OPTIONS,
  FONT_ALIGNMENT_OPTIONS,
  VIEWPORT_OPTIONS,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_COLOR,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_LEADING,
  DEFAULT_FONT_TRACKING,
  DEFAULT_FONT_ALIGNMENT,
  DEFAULT_VIEWPORT
} from './utils/optionsDefaults';
import { getOptionsWithFallback } from './utils/optionsParser';

export const ToolbarSeparator = styled(Toolbar.Separator)`
  background: ${({ theme }) => theme.colors.neutral150};
  width: 1px;
  height: 2.4rem;
`;

const SelectWrapper = styled(Box)`
  div[role='combobox'] {
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

  // Only remove borders when not inside a popover
  ${({ theme }) => `
    &:not([role="dialog"] *) {
      div[role='combobox'] {
        border: none;
      }
    }
  `}
`;

const ColorSelectWrapper = styled(SelectWrapper)`
  div[role='combobox'] {
    border: none;
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

interface PluginOptions {
  disableDefaultFonts?: boolean;
  disableDefaultSizes?: boolean;
  disableDefaultLineHeights?: boolean;
  disableDefaultAlignments?: boolean;
  disableDefaultViewports?: boolean;
  disableDefaultColors?: boolean;
  customFontsPresets?: string;
  customColorsPresets?: string;
  customViewportsPresets?: string;
  customAlignmentsPresets?: string;
  customLineHeightsPresets?: string;
  customSizesPresets?: string;
  [key: string]: any;
}

// Type guard to check if a node is a CustomElement
const isCustomElement = (node: unknown): node is CustomElement => {
  return Element.isElement(node) && 
         'type' in node && 
         typeof (node as any).type === 'string';
};

const StyleToolbar = () => {
  const { editor, disabled, pluginOptions = {} } = useBlocksEditorContext('StyleToolbar');
  const [selectedNode, setSelectedNode] = useState<CustomElement | null>(null);
  const [currentPath, setCurrentPath] = useState<any[]>([]);
  const [fontFamily, setFontFamily] = useState<string | null>(null);
  const [fontColor, setFontColor] = useState<string | null>(null);
  const [selectedViewport, setSelectedViewport] = useState<string | number>('mobile');
  const [viewportSettings, setViewportSettings] = useState<Record<string, FontSetting>>({});

  // Track if a node has been initialized
  const [initializedNodes] = useState(new Set<string>());

  // Get styling options based on plugin configuration
  const typedPluginOptions = pluginOptions as PluginOptions;
  const fontFamilyOptions = getOptionsWithFallback(
    FONT_FAMILY_OPTIONS,
    typedPluginOptions?.customFontsPresets,
    typedPluginOptions?.disableDefaultFonts
  );
  const fontColorOptions = getOptionsWithFallback(
    FONT_COLOR_OPTIONS,
    typedPluginOptions?.customColorsPresets,
    typedPluginOptions?.disableDefaultColors
  );
  const viewportOptions = getOptionsWithFallback(
    VIEWPORT_OPTIONS,
    typedPluginOptions?.customViewportsPresets,
    typedPluginOptions?.disableDefaultViewports
  );
  const fontSizeOptions = getOptionsWithFallback(
    FONT_SIZE_OPTIONS,
    typedPluginOptions?.customSizesPresets,
    typedPluginOptions?.disableDefaultSizes
  );
  const fontLeadingOptions = getOptionsWithFallback(
    FONT_LEADING_OPTIONS,
    typedPluginOptions?.customLineHeightsPresets,
    typedPluginOptions?.disableDefaultLineHeights
  );
  const fontTrackingOptions = getOptionsWithFallback(
    FONT_TRACKING_OPTIONS,
    typedPluginOptions?.customTrackingPresets,
    typedPluginOptions?.disableDefaultTracking
  );
  const fontAlignmentOptions = getOptionsWithFallback(
    FONT_ALIGNMENT_OPTIONS,
    typedPluginOptions?.customAlignmentsPresets,
    typedPluginOptions?.disableDefaultAlignments
  );

  const getDefaultValue = (options: any[], defaultValue: string) => {
    const defaultOption = options.find(opt => opt.isDefault === true);

    if (defaultOption) { return defaultOption.value }
    if (options.length > 0) { return options[0].value }
      
    return defaultValue;
  };

  // Get default values based on plugin configuration or fall back to system defaults
  const defaultFontFamily = getDefaultValue(fontFamilyOptions, DEFAULT_FONT_FAMILY);
  const defaultFontColor = getDefaultValue(fontColorOptions, DEFAULT_FONT_COLOR);
  const defaultFontSize = getDefaultValue(fontSizeOptions, DEFAULT_FONT_SIZE);
  const defaultFontLeading = getDefaultValue(fontLeadingOptions, DEFAULT_FONT_LEADING);
  const defaultFontTracking = getDefaultValue(fontTrackingOptions, DEFAULT_FONT_TRACKING);
  const defaultFontAlignment = getDefaultValue(fontAlignmentOptions, DEFAULT_FONT_ALIGNMENT);
  const defaultViewport = getDefaultValue(viewportOptions, DEFAULT_VIEWPORT);

  // Reusable handler for updating viewport-specific settings
  const updateViewportSetting = (
    settingKey: 'fontSize' | 'fontLeading' | 'fontAlignment' | 'fontTracking',
    value: string | number,
    viewport: string
  ) => {
    if (!selectedNode || !currentPath.length) return;
    
    const stringValue = String(value);
    
    // Update the viewportSettings state
    setViewportSettings(prev => {
      const newSettings = { ...prev };
      if (!newSettings[viewport]) {
        newSettings[viewport] = {
          breakpoint: viewport as 'mobile' | 'tablet' | 'desktop',
          fontSize: viewport === viewportOptions[0].value ? defaultFontSize : null,
          fontLeading: viewport === viewportOptions[0].value ? defaultFontLeading : null,
          fontTracking: viewport === viewportOptions[0].value ? defaultFontTracking : null,
          fontAlignment: viewport === viewportOptions[0].value ? defaultFontAlignment : null
        };
      }
      newSettings[viewport] = {
        ...newSettings[viewport],
        [settingKey]: stringValue
      };

      // Update the node with all viewport settings
      const allSettings = Object.values(newSettings);
      Transforms.setNodes(
        editor,
        { fontSettings: allSettings } as Partial<Node>,
        { at: currentPath }
      );
      
      return newSettings;
    });
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
  };

  // Effect for handling selection changes - keep this light
  useEffect(() => {
    if (!editor.selection) {
      setSelectedNode(null);
      setViewportSettings({});
      setFontFamily(null);
      setFontColor(null);
      return;
    }

    const entry = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && 'type' in n,
    });

    if (entry) {
      const [node, path] = entry;
      if (isCustomElement(node)) {
        setSelectedNode(node);
        setCurrentPath(path);
        setFontFamily(node.fontFamily || defaultFontFamily);
        setFontColor(node.fontColor || defaultFontColor);
        
        // Just update the UI state with existing settings
        if (node.fontSettings) {
          const settings: Record<string, FontSetting> = {};
          node.fontSettings.forEach(setting => {
            settings[setting.breakpoint] = {
              breakpoint: setting.breakpoint,
              fontSize: setting.fontSize || null,
              fontLeading: setting.fontLeading || null,
              fontTracking: setting.fontTracking || null,
              fontAlignment: setting.fontAlignment || null
            };
          });
          setViewportSettings(settings);
        } else {
          // If no settings exist, show empty state in UI
          const emptySettings: Record<string, FontSetting> = {};
          viewportOptions.forEach((option) => {
            emptySettings[option.value] = {
              breakpoint: option.value as 'mobile' | 'tablet' | 'desktop',
              fontSize: null,
              fontLeading: null,
              fontTracking: null,
              fontAlignment: null
            };
          });
          setViewportSettings(emptySettings);
        }
      }
    } else {
      setSelectedNode(null);
      setViewportSettings({});
      setFontFamily(null);
      setFontColor(null);
    }
  }, [editor.selection]);

  // Effect for initializing new nodes with default values
  useEffect(() => {
    if (!selectedNode || !currentPath.length) return;

    // Skip if this node has already been initialized
    const nodeKey = JSON.stringify(currentPath);
    if (initializedNodes.has(nodeKey)) return;

    // Initialize a new node with all required properties
    const initialSettings: Record<string, FontSetting> = {};
    viewportOptions.forEach((option, index) => {
      initialSettings[option.value] = {
        breakpoint: option.value as 'mobile' | 'tablet' | 'desktop',
        fontSize: index === 0 ? defaultFontSize : null,
        fontLeading: index === 0 ? defaultFontLeading : null,
        fontTracking: index === 0 ? defaultFontTracking : null,
        fontAlignment: index === 0 ? defaultFontAlignment : null
      };
    });

    const updatedNode = {
      ...selectedNode,
      fontFamily: selectedNode.fontFamily || defaultFontFamily,
      fontColor: selectedNode.fontColor || defaultFontColor,
      fontSettings: Object.values(initialSettings)
    };

    Transforms.setNodes(
      editor,
      updatedNode as Partial<Node>,
      { at: currentPath }
    );

    // Mark this node as initialized
    initializedNodes.add(nodeKey);
  }, [selectedNode, currentPath.join()]);

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
              value={fontFamily || defaultFontFamily}
              disabled={disabled}
              aria-label="Select font family"
            >
              {fontFamilyOptions.map((option) => (
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
              value={fontColor || defaultFontColor}
              disabled={disabled}
              aria-label="Select font color"
            >
              {fontColorOptions.map((option) => (
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
          <Popover.Root>
            <Popover.Trigger>
              <IconButton label="Advanced text settings" variant='ghost'>
                <Cog />
              </IconButton>
            </Popover.Trigger>
            <Popover.Content style={{ width: '220px', padding: '12px' }}>
              <Flex direction="column" gap={2} alignItems="flex-start">
                {/* Viewport Setting */}
                <SettingGroup width="100%">
                  <Tooltip label="Viewport">
                    <SettingIcon>
                      <FontViewportIcon />
                    </SettingIcon>
                  </Tooltip>
                  <SelectWrapper flex="1">
                    <SingleSelect
                      placeholder="Viewport"
                      onChange={setSelectedViewport}
                      value={selectedViewport || defaultViewport}
                      disabled={disabled}
                      aria-label="Select viewport"
                      size="S"
                    >
                      {viewportOptions.map((option) => (
                        <SingleSelectOption key={option.value} value={option.value}>
                          {option.label}
                        </SingleSelectOption>
                      ))}
                    </SingleSelect>
                  </SelectWrapper>
                </SettingGroup>

              {Object.keys(viewportSettings).map((setting) => (
                <DynamicSettings
                  key={`${setting}-settings`}
                  isActive={selectedViewport === setting}
                  settings={viewportSettings[setting]}
                  onSettingChange={updateViewportSetting}
                  disabled={disabled}
                  fontSizeOptions={fontSizeOptions}
                  fontLeadingOptions={fontLeadingOptions}
                  fontTrackingOptions={fontTrackingOptions}
                  fontAlignmentOptions={fontAlignmentOptions}
                />
              ))}
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