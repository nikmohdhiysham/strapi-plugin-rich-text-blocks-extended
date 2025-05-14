import React, { useState } from 'react';
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
import { Editor, Element } from 'slate';
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

const getDefaultValue = (options: any[], defaultValue: string) => {
  const foundOption = options.find(opt => opt.value === defaultValue);
  if (foundOption) return foundOption.value;
  if (options.length > 0) return options[0].value;
  return defaultValue;
};

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
         typeof (node as any).type === 'string' &&
         (!('fontSettings' in node) || Array.isArray((node as any).fontSettings));
};

// Add type for node properties
interface NodeProperties {
  fontSettings?: FontSetting[];
  fontFamily?: string;
  fontColor?: string;
  type?: string;
}

const StyleToolbar = () => {
  const { editor, disabled, pluginOptions = {} } = useBlocksEditorContext('StyleToolbar');

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

  // Get default values based on plugin configuration or fall back to system defaults
  const defaultFontFamily = getDefaultValue(fontFamilyOptions, DEFAULT_FONT_FAMILY);
  const defaultFontColor = getDefaultValue(fontColorOptions, DEFAULT_FONT_COLOR);
  const defaultFontSize = getDefaultValue(fontSizeOptions, DEFAULT_FONT_SIZE);
  const defaultFontLeading = getDefaultValue(fontLeadingOptions, DEFAULT_FONT_LEADING);
  const defaultFontTracking = getDefaultValue(fontTrackingOptions, DEFAULT_FONT_TRACKING);
  const defaultFontAlignment = getDefaultValue(fontAlignmentOptions, DEFAULT_FONT_ALIGNMENT);
  const defaultViewport = getDefaultValue(viewportOptions, DEFAULT_VIEWPORT);

  // State for the style toolbar - only update when selection changes to a different node
  const [isOpen, setIsOpen] = useState(false);
  const [selectedViewport, setSelectedViewport] = useState(defaultViewport);
  const [viewportSettings, setViewportSettings] = useState<Record<string, FontSetting>>({});

  // Get current selected node
  const entry = editor.selection ? Editor.above(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && 'type' in n,
  }) : null;

  const selectedNode = entry ? entry[0] as CustomElement : null;
  const currentPath = entry ? entry[1] : [];

  // Initialize viewport settings when node changes - THIS CAN BE IMPROVED
  React.useEffect(() => {
    if (!selectedNode) {
      setViewportSettings({});
      return;
    }

    if (isCustomElement(selectedNode)) {
      // Initialize settings from node's fontSettings or create empty settings
      if (selectedNode.fontSettings) {
        const settings: Record<string, FontSetting> = {};
        selectedNode.fontSettings.forEach(setting => {
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
        // If no settings exist, initialize with empty settings for each viewport
        const emptySettings: Record<string, FontSetting> = {};
        viewportOptions.forEach((option) => {
          emptySettings[option.value] = getDefaultSettings(option.value);
        });
        setViewportSettings(emptySettings);

        // Initialize the node with default settings
        if (!['code', 'image'].includes(selectedNode.type)) {
          const properties = {
            fontFamily: selectedNode.fontFamily || defaultFontFamily,
            fontColor: selectedNode.fontColor || defaultFontColor,
            fontSettings: Object.values(emptySettings)
          } as unknown as Partial<Node>;

          Editor.withoutNormalizing(editor, () => {
            editor.apply({
              type: 'set_node',
              path: currentPath,
              properties,
              newProperties: properties
            });
          });
        }
      }
    }
  }, [selectedNode?.type, currentPath.join()]);

  // Get current node's font settings
  const fontFamily = selectedNode?.fontFamily || defaultFontFamily;
  const fontColor = selectedNode?.fontColor || defaultFontColor;

  const getDefaultSettings = (viewport: string) => ({
    breakpoint: viewport,
    fontSize: viewport === viewportOptions[0].value ? defaultFontSize : null,
    fontLeading: viewport === viewportOptions[0].value ? defaultFontLeading : null,
    fontTracking: viewport === viewportOptions[0].value ? defaultFontTracking : null,
    fontAlignment: viewport === viewportOptions[0].value ? defaultFontAlignment : null
  });
  
  // Update viewport settings without triggering re-renders during typing
  const updateViewportSetting = (
    settingKey: 'fontSize' | 'fontLeading' | 'fontAlignment' | 'fontTracking',
    value: string | number | null,
    viewport: string
  ) => {
    if (!selectedNode || !currentPath.length) return;
    
    const newValue = !value ? null : String(value);
    
    // Update the viewportSettings state
    const newSettings = { ...viewportSettings };
    
    if (!newSettings[viewport]) {
      newSettings[viewport] = getDefaultSettings(viewport);
    }

    newSettings[viewport] = {
      ...newSettings[viewport],
      [settingKey]: newValue
    };

    // Update the node with all viewport settings
    const allSettings = Object.values(newSettings);
    Editor.withoutNormalizing(editor, () => {
      const properties = { fontSettings: allSettings } as unknown as Partial<Node>;
      editor.apply({
        type: 'set_node',
        path: currentPath,
        properties,
        newProperties: properties
      });
    });
    
    setViewportSettings(newSettings);
  };

  // Handle font family change
  const handleFontFamilyChange = (value: string | number) => {
    if (!selectedNode || !currentPath.length) return;
    
    const stringValue = String(value);
    
    Editor.withoutNormalizing(editor, () => {
      const properties = { fontFamily: stringValue } as unknown as Partial<Node>;
      editor.apply({
        type: 'set_node',
        path: currentPath,
        properties,
        newProperties: properties
      });
    });
  };

  // Handle font color change
  const handleFontColorChange = (value: string | number) => {
    if (!selectedNode || !currentPath.length) return;
    
    const stringValue = String(value);
    
    Editor.withoutNormalizing(editor, () => {
      const properties = { fontColor: stringValue } as unknown as Partial<Node>;
      editor.apply({
        type: 'set_node',
        path: currentPath,
        properties,
        newProperties: properties
      });
    });
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
              value={fontFamily}
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
              value={fontColor}
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
          <Popover.Root open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);

            // Reset on open
            if (open) {
              setSelectedViewport(defaultViewport);
            }
          }}>
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
                      value={selectedViewport}
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