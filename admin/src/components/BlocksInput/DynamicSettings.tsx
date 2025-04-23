import React from 'react';
import { Box, Flex, SingleSelect, SingleSelectOption, Tooltip, Combobox, ComboboxOption } from '@strapi/design-system';
import { styled } from 'styled-components';
import { FontSizeIcon, FontLeadingIcon, FontAlignmentIcon } from './FontSettingsIcons';
import { Option, FontSetting } from './utils/types';

export interface DynamicSettingsProps {
  viewport: string | number;
  settings: Record<string, FontSetting>;
  onSettingChange: (key: 'fontSize' | 'fontLeading' | 'fontAlignment', value: string | number, viewport: string) => void;
  disabled?: boolean;
  fontSizeOptions: Option[];
  fontLeadingOptions: Option[];
  fontAlignmentOptions: Option[];
  viewportOptions: Option[];
}

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

const ViewportSettings = styled(Box)<{ isActive: boolean }>`
  display: ${({ isActive }) => isActive ? 'block' : 'none'};
`;

const DynamicSettings = ({ 
  viewport,
  settings,
  onSettingChange, 
  disabled,
  fontSizeOptions,
  fontLeadingOptions,
  fontAlignmentOptions,
  viewportOptions
}: DynamicSettingsProps) => {
  return (
    <>
      {viewportOptions.map((viewportOption) => {
        const { breakpoint, fontSize, fontLeading, fontAlignment } = settings[viewportOption.value];

        return (
          <ViewportSettings key={viewportOption.value} isActive={viewport === viewportOption.value}>
            {/* Font Size Setting */}
            <SettingGroup width="100%">
              <Tooltip label="Font Size">
              <SettingIcon>
                <FontSizeIcon />
              </SettingIcon>
            </Tooltip>
            <SelectWrapper flex="1">
              <Combobox
                autoComplete='off'
                autocomplete={{ type: "none" }}
                placeholder="Font Size"
                aria-label="Select or create font size"
                value={fontSize || ''}
                onChange={(value) => onSettingChange('fontSize', value, breakpoint)}
                creatable="visible"
                disabled={disabled}
                size="S"
                clearLabel="Clear font size"
                createMessage={(value: string) => value ? `Set "${value}"` : ''}
              >
                {fontSizeOptions.map(({ value, label }: Option) => (
                  <ComboboxOption key={value} value={value}>
                    {label}
                  </ComboboxOption>
                ))}
              </Combobox>
            </SelectWrapper>
          </SettingGroup>

          {/* Line Height Setting */}
          <SettingGroup width="100%">
            <Tooltip label="Line Height">
              <SettingIcon>
                <FontLeadingIcon />
              </SettingIcon>
            </Tooltip>
            <SelectWrapper flex="1">
              <Combobox
                autoComplete='off'
                autocomplete={{ type: "none" }}
                placeholder="Line Height"
                aria-label="Select or set line height"
                value={fontLeading || ''}
                onChange={(value) => onSettingChange('fontLeading', value, breakpoint)}
                creatable="visible"
                size="S"
                disabled={disabled}
                clearLabel="Clear line height"
                createMessage={(value: string) => value ? `Set "${value}"` : ''}
              >
                {fontLeadingOptions.map(({ value, label }: Option) => (
                  <ComboboxOption key={value} value={value}>
                    {label}
                  </ComboboxOption>
                ))}
              </Combobox>
            </SelectWrapper>
          </SettingGroup>

          {/* Text Alignment Setting */}
          <SettingGroup width="100%">
            <Tooltip label="Text Alignment">
              <SettingIcon>
                <FontAlignmentIcon />
              </SettingIcon>
            </Tooltip>
            <SelectWrapper flex="1">
              <SingleSelect
                placeholder="Text Alignment"
                onChange={(value) => onSettingChange('fontAlignment', value, breakpoint)}
                value={fontAlignment || ''}
                disabled={disabled}
                aria-label="Select text alignment"
                size="S"
              >
                {fontAlignmentOptions.map((option) => (
                  <SingleSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </SingleSelectOption>
                ))}
              </SingleSelect>
            </SelectWrapper>
            </SettingGroup>
          </ViewportSettings>
        );
      })}
    </>
  );
};

export default DynamicSettings; 