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
import { ViewportIcon } from './AdvancedSettingsIcons';
import { useBlocksEditorContext } from './BlocksEditor';
import { CustomElement, FontSetting, SeparatorSetting, ImageSetting, ImageElement } from './utils/types';
import DynamicSettings from './DynamicSettings';
import {
  // Global
  VIEWPORT_OPTIONS,
  COLORS_OPTIONS,
  DEFAULT_VIEWPORT,
  DEFAULT_COLOR,
  // Font
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  FONT_LEADING_OPTIONS,
  FONT_TRACKING_OPTIONS,
  FONT_ALIGNMENT_OPTIONS,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_LEADING,
  DEFAULT_FONT_TRACKING,
  DEFAULT_FONT_ALIGNMENT,
  // Separator
  SEPARATOR_STYLE_OPTIONS,
  SEPARATOR_ORIENTATION_OPTIONS,
  DEFAULT_SEPARATOR_STYLE,
  DEFAULT_SEPARATOR_SIZE,
  DEFAULT_SEPARATOR_LENGTH,
  DEFAULT_SEPARATOR_ORIENTATION,
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
  background-color: ${(props) => props.color};
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
  const foundOption = options.find((opt) => opt.value === defaultValue);
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
  return (
    Element.isElement(node) &&
    'type' in node &&
    typeof (node as any).type === 'string' &&
    (!('fontSettings' in node) || Array.isArray((node as any).fontSettings))
  );
};

const StyleToolbar = () => {
  const { editor, disabled, pluginOptions = {} } = useBlocksEditorContext('StyleToolbar');

  // Get styling options based on plugin configuration
  const typedPluginOptions = pluginOptions as PluginOptions;
  // Global Options
  const viewportOptions = getOptionsWithFallback(
    VIEWPORT_OPTIONS,
    typedPluginOptions?.customViewportsPresets,
    typedPluginOptions?.disableDefaultViewports
  );
  const colorOptions = getOptionsWithFallback(
    COLORS_OPTIONS,
    typedPluginOptions?.customColorsPresets,
    typedPluginOptions?.disableDefaultColors
  );
  // Font Options
  const fontFamilyOptions = getOptionsWithFallback(
    FONT_FAMILY_OPTIONS,
    typedPluginOptions?.customFontsPresets,
    typedPluginOptions?.disableDefaultFonts
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
  // Separator Options
  const separatorStyleOptions = SEPARATOR_STYLE_OPTIONS;
  const separatorOrientationOptions = SEPARATOR_ORIENTATION_OPTIONS;

  // Get default values based on plugin configuration or fall back to system defaults
  const defaultViewport = getDefaultValue(viewportOptions, DEFAULT_VIEWPORT);
  const defaultColor = getDefaultValue(colorOptions, DEFAULT_COLOR);
  // Font defaults
  const defaultFontFamily = getDefaultValue(fontFamilyOptions, DEFAULT_FONT_FAMILY);
  const defaultFontSize = getDefaultValue(fontSizeOptions, DEFAULT_FONT_SIZE);
  const defaultFontLeading = getDefaultValue(fontLeadingOptions, DEFAULT_FONT_LEADING);
  const defaultFontTracking = getDefaultValue(fontTrackingOptions, DEFAULT_FONT_TRACKING);
  const defaultFontAlignment = getDefaultValue(fontAlignmentOptions, DEFAULT_FONT_ALIGNMENT);
  // Separator defaults
  const defaultSeparatorStyle = DEFAULT_SEPARATOR_STYLE;
  const defaultSeparatorSize = DEFAULT_SEPARATOR_SIZE;
  const defaultSeparatorLength = DEFAULT_SEPARATOR_LENGTH;
  const defaultSeparatorOrientation = DEFAULT_SEPARATOR_ORIENTATION;

  // State for the style toolbar - only update when selection changes to a different node
  const [isOpen, setIsOpen] = useState(false);
  const [selectedViewport, setSelectedViewport] = useState(defaultViewport);
  const [fontSettings, setFontSettings] = useState<Record<string, FontSetting>>({});
  const [separatorSettings, setSeparatorSettings] = useState<Record<string, SeparatorSetting>>({});
  const [imageSettings, setImageSettings] = useState<Record<string, ImageSetting>>({});

  // Get current selected node
  const entry = editor.selection
    ? Editor.above(editor, {
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && 'type' in n,
      })
    : null;

  const selectedNode = entry ? (entry[0] as CustomElement) : null;
  const currentPath = entry ? entry[1] : [];

  // Initialize viewport settings when node changes - THIS CAN BE IMPROVED
  React.useEffect(() => {
    if (!selectedNode) {
      setFontSettings({});
      setSeparatorSettings({});
      setImageSettings({});
      return;
    }

    if (selectedNode.type === 'separator') {
      // Initialize separator settings
      const element = selectedNode as any;
      if (element.separatorSettings) {
        const settings: Record<string, SeparatorSetting> = {};
        element.separatorSettings.forEach((setting: SeparatorSetting) => {
          settings[setting.breakpoint] = setting;
        });
        setSeparatorSettings(settings);
      } else {
        // Initialize with default separator settings for each viewport
        const defaultSettings: Record<string, SeparatorSetting> = {};
        viewportOptions.forEach((option) => {
          defaultSettings[option.value] = {
            breakpoint: option.value,
            separatorSize: option.value === viewportOptions[0].value ? defaultSeparatorSize : null,
            separatorLength:
              option.value === viewportOptions[0].value ? defaultSeparatorLength : null,
            separatorOrientation:
              option.value === viewportOptions[0].value
                ? (defaultSeparatorOrientation as 'horizontal')
                : null,
          };
        });
        setSeparatorSettings(defaultSettings);

        // Initialize the node with default settings
        const properties = {
          separatorStyle: element.separatorStyle || defaultSeparatorStyle,
          separatorColor: element.separatorColor || defaultColor,
          separatorSettings: Object.values(defaultSettings),
        } as unknown as Partial<Node>;

        Editor.withoutNormalizing(editor, () => {
          editor.apply({
            type: 'set_node',
            path: currentPath,
            properties,
            newProperties: properties,
          });
        });
      }
    } else if (isCustomElement(selectedNode)) {
      // Initialize settings from node's fontSettings or create empty settings
      if (selectedNode.fontSettings) {
        const settings: Record<string, FontSetting> = {};
        selectedNode.fontSettings.forEach((setting) => {
          settings[setting.breakpoint] = {
            breakpoint: setting.breakpoint,
            fontSize: setting.fontSize || null,
            fontLeading: setting.fontLeading || null,
            fontTracking: setting.fontTracking || null,
            fontAlignment: setting.fontAlignment || null,
          };
        });
        setFontSettings(settings);
      } else {
        // If no settings exist, initialize with empty settings for each viewport
        const emptySettings: Record<string, FontSetting> = {};
        viewportOptions.forEach((option) => {
          emptySettings[option.value] = getDefaultSettings(option.value);
        });
        setFontSettings(emptySettings);

        // Initialize the node with default settings
        if (!['code', 'image'].includes(selectedNode.type)) {
          const properties = {
            fontFamily: selectedNode.fontFamily || defaultFontFamily,
            fontColor: selectedNode.fontColor || defaultColor,
            fontSettings: Object.values(emptySettings),
          } as unknown as Partial<Node>;

          Editor.withoutNormalizing(editor, () => {
            editor.apply({
              type: 'set_node',
              path: currentPath,
              properties,
              newProperties: properties,
            });
          });
        }
      }
    }

    if (selectedNode.type === 'image') {
      // Initialize image settings
      const imageElement = selectedNode as ImageElement;
      const intrinsicWidth = imageElement.image?.width;
      const intrinsicHeight = imageElement.image?.height;
      
      if (selectedNode.imageSettings) {
        const settings: Record<string, ImageSetting> = {};
        selectedNode.imageSettings.forEach((setting: ImageSetting) => {
          settings[setting.breakpoint] = {
            breakpoint: setting.breakpoint,
            imageWidth: setting.imageWidth || null,
            imageHeight: setting.imageHeight || null,
            imageAspectRatioLocked: setting.imageAspectRatioLocked !== undefined ? setting.imageAspectRatioLocked : true,
          };
        });
        setImageSettings(settings);
      } else {
        // If no settings exist, initialize with intrinsic dimensions for mobile
        const emptySettings: Record<string, ImageSetting> = {};
        viewportOptions.forEach((option) => {
          emptySettings[option.value] = {
            breakpoint: option.value,
            // Use intrinsic dimensions as defaults for mobile viewport
            imageWidth: option.value === 'mobile' && intrinsicWidth ? intrinsicWidth.toString() : null,
            imageHeight: option.value === 'mobile' && intrinsicHeight ? intrinsicHeight.toString() : null,
            imageAspectRatioLocked: true, // Default to locked aspect ratio
          };
        });
        setImageSettings(emptySettings);

        // Initialize the node with settings including intrinsic dimensions for mobile
        const properties = {
          imageSettings: Object.values(emptySettings),
        } as unknown as Partial<Node>;

        Editor.withoutNormalizing(editor, () => {
          editor.apply({
            type: 'set_node',
            path: currentPath,
            properties,
            newProperties: properties,
          });
        });
      }
    }
  }, [selectedNode?.type, currentPath.join()]);

  // Get current node's font/separator settings
  const fontFamily = selectedNode?.fontFamily || defaultFontFamily;
  const fontColor = selectedNode?.fontColor || defaultColor;
  const separatorStyle = selectedNode?.separatorStyle || defaultSeparatorStyle;
  const separatorColor = selectedNode?.separatorColor || defaultColor;

  const getDefaultSettings = (viewport: string) => ({
    breakpoint: viewport,
    fontSize: viewport === viewportOptions[0].value ? defaultFontSize : null,
    fontLeading: viewport === viewportOptions[0].value ? defaultFontLeading : null,
    fontTracking: viewport === viewportOptions[0].value ? defaultFontTracking : null,
    fontAlignment: viewport === viewportOptions[0].value ? defaultFontAlignment : null,
  });

  // Update viewport settings without triggering re-renders during typing
  const updateViewportSetting = (
    settingKey: 'fontSize' | 'fontLeading' | 'fontAlignment' | 'fontTracking',
    value: string | number | null,
    viewport: string
  ) => {
    if (!selectedNode || !currentPath.length) return;

    const newValue = !value ? null : String(value);

    // Update the fontSettings state
    const newSettings = { ...fontSettings };

    if (!newSettings[viewport]) {
      newSettings[viewport] = getDefaultSettings(viewport);
    }

    newSettings[viewport] = {
      ...newSettings[viewport],
      [settingKey]: newValue,
    };

    // Update the node with all viewport settings
    const allSettings = Object.values(newSettings);
    Editor.withoutNormalizing(editor, () => {
      const properties = { fontSettings: allSettings } as unknown as Partial<Node>;
      editor.apply({
        type: 'set_node',
        path: currentPath,
        properties,
        newProperties: properties,
      });
    });

    setFontSettings(newSettings);
  };

  // Update separator viewport settings
  const updateSeparatorSetting = (
    settingKey: 'separatorSize' | 'separatorOrientation' | 'separatorLength',
    value: string | number | null,
    viewport: string
  ) => {
    if (!selectedNode || !currentPath.length) return;

    const newValue =
      value === null || value === undefined
        ? null
        : settingKey === 'separatorSize' || settingKey === 'separatorLength'
          ? Number(value)
          : String(value);

    // Update the separatorSettings state
    const newSettings = { ...separatorSettings };

    if (!newSettings[viewport]) {
      newSettings[viewport] = {
        breakpoint: viewport,
        separatorSize: null,
        separatorOrientation: null,
        separatorLength: null,
      };
    }

    newSettings[viewport] = {
      ...newSettings[viewport],
      [settingKey]: newValue as any,
    };

    // Update the node with all separator settings
    const allSettings = Object.values(newSettings);
    Editor.withoutNormalizing(editor, () => {
      const properties = { separatorSettings: allSettings } as unknown as Partial<Node>;
      editor.apply({
        type: 'set_node',
        path: currentPath,
        properties,
        newProperties: properties,
      });
    });

    setSeparatorSettings(newSettings);
  };

  // Update image viewport settings
  const updateImageSetting = (
    settingKey: 'imageWidth' | 'imageHeight' | 'imageAspectRatioLocked',
    value: string | boolean | null,
    viewport: string
  ) => {
    if (!selectedNode || !currentPath.length) return;

    const newSettings = { ...imageSettings };
    const imageElement = selectedNode as ImageElement;
    const intrinsicWidth = imageElement.image?.width;
    const intrinsicHeight = imageElement.image?.height;

    if (!newSettings[viewport]) {
      newSettings[viewport] = {
        breakpoint: viewport,
        imageWidth: null,
        imageHeight: null,
        imageAspectRatioLocked: true,
      };
    }

    // Handle aspect ratio toggle
    if (settingKey === 'imageAspectRatioLocked') {
      newSettings[viewport] = {
        ...newSettings[viewport],
        imageAspectRatioLocked: value as boolean,
      };
    } else {
      // Handle width/height changes with aspect ratio preservation
      const currentSettings = newSettings[viewport];
      const isLocked = currentSettings.imageAspectRatioLocked !== false; // Default to true
      
      if (isLocked && intrinsicWidth && intrinsicHeight && value !== null) {
        const aspectRatio = intrinsicWidth / intrinsicHeight;
        
        if (settingKey === 'imageWidth') {
          const newWidth = parseInt(value as string);
          const newHeight = Math.round(newWidth / aspectRatio);
          newSettings[viewport] = {
            ...currentSettings,
            imageWidth: value as string,
            imageHeight: newHeight.toString(),
          };
        } else if (settingKey === 'imageHeight') {
          const newHeight = parseInt(value as string);
          const newWidth = Math.round(newHeight * aspectRatio);
          newSettings[viewport] = {
            ...currentSettings,
            imageWidth: newWidth.toString(),
            imageHeight: value as string,
          };
        }
      } else {
        // Just update the single value if not locked or no intrinsic dimensions
        newSettings[viewport] = {
          ...newSettings[viewport],
          [settingKey]: value,
        };
      }
    }

    // Update the node with all image settings
    const allSettings = Object.values(newSettings);
    Editor.withoutNormalizing(editor, () => {
      const properties = { imageSettings: allSettings } as unknown as Partial<Node>;
      editor.apply({
        type: 'set_node',
        path: currentPath,
        properties,
        newProperties: properties,
      });
    });

    setImageSettings(newSettings);
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
        newProperties: properties,
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
        newProperties: properties,
      });
    });
  };

  if (!selectedNode) {
    return null;
  }

  const showFontOptions =
    selectedNode?.type && !['image', 'code', 'separator'].includes(selectedNode.type);
  const showSeparatorOptions = selectedNode?.type === 'separator';
  const showImageOptions = selectedNode?.type === 'image';

  return (
    <>
      <Flex gap={2}>
        {/* Font Family Selector */}
        {showFontOptions && (
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
        {showFontOptions && (
          <ColorSelectWrapper>
            <SingleSelect
              placeholder="Color"
              onChange={handleFontColorChange}
              value={fontColor}
              disabled={disabled}
              aria-label="Select font color"
            >
              {colorOptions.map((option) => (
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

        {/* Separator Controls (Non-viewport specific: style and color) */}
        {showSeparatorOptions && (
          <>
            {/* Separator Style */}
            <SelectWrapper>
              <SingleSelect
                placeholder="Style"
                onChange={(value) => {
                  if (!currentPath.length) return;
                  Editor.withoutNormalizing(editor, () => {
                    const properties = {
                      separatorStyle: String(value),
                    } as unknown as Partial<Node>;
                    editor.apply({
                      type: 'set_node',
                      path: currentPath,
                      properties,
                      newProperties: properties,
                    });
                  });
                }}
                value={separatorStyle}
                disabled={disabled}
                aria-label="Select separator style"
              >
                {separatorStyleOptions.map((option) => (
                  <SingleSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </SingleSelectOption>
                ))}
              </SingleSelect>
            </SelectWrapper>

            {/* Separator Color */}
            <ColorSelectWrapper>
              <SingleSelect
                placeholder="Color"
                onChange={(value) => {
                  if (!currentPath.length) return;
                  Editor.withoutNormalizing(editor, () => {
                    const properties = {
                      separatorColor: String(value),
                    } as unknown as Partial<Node>;
                    editor.apply({
                      type: 'set_node',
                      path: currentPath,
                      properties,
                      newProperties: properties,
                    });
                  });
                }}
                value={separatorColor}
                disabled={disabled}
                aria-label="Select separator color"
              >
                {colorOptions.map((option) => (
                  <SingleSelectOption key={option.value} value={option.value}>
                    <Flex alignItems="center" pointerEvents="none">
                      <ColorSwatch color={option.value} />
                      <span>{option.label}</span>
                    </Flex>
                  </SingleSelectOption>
                ))}
              </SingleSelect>
            </ColorSelectWrapper>
          </>
        )}

        {/* Advanced Settings Popover (Viewport settings) */}
        {(showFontOptions || showSeparatorOptions || showImageOptions) && (
          <Popover.Root
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);

              // Reset on open
              if (open) {
                setSelectedViewport(defaultViewport);
              }
            }}
          >
            <Popover.Trigger>
              <IconButton label="Advanced settings" variant="ghost">
                <Cog />
              </IconButton>
            </Popover.Trigger>
            <Popover.Content style={{ width: '220px', padding: '12px' }}>
              <Flex direction="column" gap={2} alignItems="flex-start">
                {/* Viewport Setting */}
                <SettingGroup width="100%">
                  <Tooltip label="Viewport">
                    <SettingIcon>
                      <ViewportIcon />
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

                {showImageOptions
                  ? // Render image settings
                    Object.keys(imageSettings).map((setting) => (
                      <DynamicSettings
                        key={`${setting}-image-settings`}
                        isActive={selectedViewport === setting}
                        settings={imageSettings[setting] as any}
                        onSettingChange={updateImageSetting as any}
                        disabled={disabled}
                        isImage
                      />
                    ))
                  : showSeparatorOptions
                    ? // Render separator settings
                      Object.keys(separatorSettings).map((setting) => (
                        <DynamicSettings
                          key={`${setting}-separator-settings`}
                          isActive={selectedViewport === setting}
                          settings={separatorSettings[setting] as any}
                          onSettingChange={updateSeparatorSetting as any}
                          disabled={disabled}
                          isSeparator
                          separatorOrientationOptions={separatorOrientationOptions}
                        />
                      ))
                    : // Render font settings
                      Object.keys(fontSettings).map((setting) => (
                        <DynamicSettings
                          key={`${setting}-settings`}
                          isActive={selectedViewport === setting}
                          settings={fontSettings[setting]}
                          onSettingChange={updateViewportSetting as any}
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

      {(showFontOptions || showSeparatorOptions || showImageOptions) && <ToolbarSeparator />}
    </>
  );
};

export default StyleToolbar;
