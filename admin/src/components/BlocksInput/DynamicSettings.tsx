import React, { useState } from 'react';
import { Box, Flex, SingleSelect, SingleSelectOption, Tooltip, Combobox, ComboboxOption } from '@strapi/design-system';
import { styled } from 'styled-components';
import { FontSizeIcon, FontLeadingIcon, FontAlignmentIcon, FontTrackingIcon } from './FontSettingsIcons';
import { Option, FontSetting } from './utils/types';

export interface DynamicSettingsProps {
  isActive: boolean;
  settings: FontSetting;
  onSettingChange: (key: 'fontSize' | 'fontLeading' | 'fontAlignment' | 'fontTracking', value: string | number, viewport: string) => void;
  disabled?: boolean;
  fontSizeOptions: Option[];
  fontLeadingOptions: Option[];
  fontTrackingOptions: Option[];
  fontAlignmentOptions: Option[];
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

const ViewportSettings = styled(Box)<{ $isActive: boolean }>`
  display: ${({ $isActive }) => $isActive ? 'block' : 'none'};
`;

const getInitialOptions = (value: string | null, initialOptions: Option[]) : Option[] => {
  if (!value || initialOptions.find((option) => option.value === value)) { return initialOptions }

  return [{ value, label: value }, ...initialOptions];
};

const DynamicSettings = ({ 
  isActive,
  settings,
  onSettingChange, 
  disabled,
  fontSizeOptions: defaultFontSizeOptions,
  fontLeadingOptions: defaultFontLeadingOptions,
  fontTrackingOptions: defaultFontTrackingOptions,
  fontAlignmentOptions,
}: DynamicSettingsProps) => {
  const { breakpoint, fontSize, fontLeading, fontAlignment, fontTracking } = settings;
  const initialFontSizeOptions = getInitialOptions(fontSize, defaultFontSizeOptions);
  const initialFontLeadingOptions = getInitialOptions(fontLeading, defaultFontLeadingOptions);
  const initialFontTrackingOptions = getInitialOptions(fontTracking, defaultFontTrackingOptions);

  const [isFontSizeValid, setIsFontSizeValid] = useState(true);
  const [fontSizeOptions, setFontSizeOptions] = useState(initialFontSizeOptions);
  const [isFontLeadingValid, setIsFontLeadingValid] = useState(true);
  const [fontLeadingOptions, setFontLeadingOptions] = useState(initialFontLeadingOptions);
  const [isFontTrackingValid, setIsFontTrackingValid] = useState(true);
  const [fontTrackingOptions, setFontTrackingOptions] = useState(initialFontTrackingOptions);

  const isValidNumber = (value: string, allowNegative: boolean = false) => {
    const regex = allowNegative ? /^-?\d*\.?\d+$/ : /^\d*\.?\d+$/;
    return !!value && regex.test(value) && (allowNegative ? true : Number(value) > 0);
  };

  return (
    <ViewportSettings $isActive={isActive}>
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
            creatable={isFontSizeValid ? "visible" : false}
            onTextValueChange={(value) => setIsFontSizeValid(isValidNumber(value))}
            onCreateOption={(value) => {
              if (value) {
                setFontSizeOptions([{ value, label: value }, ...fontSizeOptions]);
              }
            }}
            disabled={disabled}
            size="S"
            clearLabel="Clear font size"
            createMessage={isFontSizeValid ? (value: string) => `Set "${value}"` : undefined}
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
            creatable={isFontLeadingValid ? "visible" : false}
            onTextValueChange={(value) => setIsFontLeadingValid(isValidNumber(value))}
            onCreateOption={(value) => {
              if (value) {
                setFontLeadingOptions([{ value, label: value }, ...fontLeadingOptions]);
              }
            }}
            size="S"
            disabled={disabled}
            clearLabel="Clear line height"
            createMessage={isFontLeadingValid ? (value: string) => `Set "${value}"` : undefined}
          >
            {fontLeadingOptions.map(({ value, label }: Option) => (
              <ComboboxOption key={value} value={value}>
                {label}
              </ComboboxOption>
            ))}
          </Combobox>
        </SelectWrapper>
      </SettingGroup>

      {/* Letter Spacing Setting */}
      <SettingGroup width="100%">
        <Tooltip label="Letter Spacing">
          <SettingIcon>
            <FontTrackingIcon />
          </SettingIcon>
        </Tooltip>
        <SelectWrapper flex="1">
          <Combobox
            autoComplete='off'
            autocomplete={{ type: "none" }}
            placeholder="Letter Spacing"
            aria-label="Select or set letter spacing"
            value={fontTracking || ''}
            onChange={(value) => onSettingChange('fontTracking', value, breakpoint)}
            creatable={isFontTrackingValid ? "visible" : false}
            onTextValueChange={(value) => setIsFontTrackingValid(isValidNumber(value, true))}
            onCreateOption={(value) => {
              if (value) {
                setFontTrackingOptions([{ value, label: value }, ...fontTrackingOptions]);
              }
            }}
            size="S"
            disabled={disabled}
            clearLabel="Clear letter spacing"
            createMessage={isFontTrackingValid ? (value: string) => `Set "${value}"` : undefined}
          >
            {fontTrackingOptions.map(({ value, label }: Option) => (
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
};

export default DynamicSettings; 