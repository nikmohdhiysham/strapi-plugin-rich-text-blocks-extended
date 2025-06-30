import { useState } from 'react';
import {
  Box,
  Flex,
  SingleSelect,
  SingleSelectOption,
  Tooltip,
  Combobox,
  ComboboxOption,
  NumberInput,
  IconButton,
} from '@strapi/design-system';
import { Link } from '@strapi/icons';
import { styled } from 'styled-components';
import {
  FontSizeIcon,
  FontLeadingIcon,
  FontAlignmentIcon,
  FontTrackingIcon,
  SeparatorSizeIcon,
  SeparatorLengthIcon,
  SeparatorOrientationIcon,
} from './AdvancedSettingsIcons';
import { Option, FontSetting, SeparatorSetting, ImageSetting } from './utils/types';

export interface DynamicSettingsProps {
  isActive: boolean;
  settings: FontSetting | SeparatorSetting | ImageSetting;
  onSettingChange: (
    key:
      | 'fontSize'
      | 'fontLeading'
      | 'fontAlignment'
      | 'fontTracking'
      | 'separatorSize'
      | 'separatorOrientation'
      | 'separatorLength'
      | 'imageWidth'
      | 'imageHeight'
      | 'imageAspectRatioLocked',
    value: string | number | boolean | null,
    viewport: string
  ) => void;
  disabled?: boolean;
  fontSizeOptions?: Option[];
  fontLeadingOptions?: Option[];
  fontTrackingOptions?: Option[];
  fontAlignmentOptions?: Option[];
  isSeparator?: boolean;
  isImage?: boolean;
  separatorOrientationOptions?: Option[];
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
  width: 100%;
  display: ${({ $isActive }) => ($isActive ? 'block' : 'none')};
`;

const getInitialOptions = (value: string | null, initialOptions: Option[]): Option[] => {
  if (!value || initialOptions.find((option) => option.value === value)) {
    return initialOptions;
  }

  return [{ value, label: value }, ...initialOptions];
};

const DynamicSettings = ({
  isActive,
  settings,
  onSettingChange,
  disabled,
  fontSizeOptions: defaultFontSizeOptions = [],
  fontLeadingOptions: defaultFontLeadingOptions = [],
  fontTrackingOptions: defaultFontTrackingOptions = [],
  fontAlignmentOptions = [],
  isSeparator = false,
  isImage = false,
  separatorOrientationOptions = [],
}: DynamicSettingsProps) => {
  const { breakpoint } = settings;

  // Font settings
  const fontSize = 'fontSize' in settings ? settings.fontSize : null;
  const fontLeading = 'fontLeading' in settings ? settings.fontLeading : null;
  const fontAlignment = 'fontAlignment' in settings ? settings.fontAlignment : null;
  const fontTracking = 'fontTracking' in settings ? settings.fontTracking : null;

  // Separator settings
  const separatorSize = 'separatorSize' in settings ? settings.separatorSize : null;
  const separatorOrientation =
    'separatorOrientation' in settings ? settings.separatorOrientation : null;
  const separatorLength = 'separatorLength' in settings ? settings.separatorLength : null;

  // Image settings
  const imageWidth = 'imageWidth' in settings ? settings.imageWidth : null;
  const imageHeight = 'imageHeight' in settings ? settings.imageHeight : null;
  const imageAspectRatioLocked =
    'imageAspectRatioLocked' in settings ? settings.imageAspectRatioLocked : true;
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

  if (isImage) {
    return (
      <ViewportSettings $isActive={isActive}>
        <Flex gap={2} width="100%">
          {/* Width and Height in a column */}
          <Flex direction="column" gap={2} flex="1">
            {/* Width Setting */}
            <SettingGroup width="100%">
              <Tooltip label="Width">
                <SettingIcon>
                  <Box fontWeight="bold" fontSize="18px">
                    W
                  </Box>
                </SettingIcon>
              </Tooltip>
              <Box flex="1">
                <NumberInput
                  placeholder="Width"
                  name="width"
                  onValueChange={(value) =>
                    onSettingChange(
                      'imageWidth',
                      value !== undefined ? value.toString() : null,
                      breakpoint
                    )
                  }
                  value={imageWidth ? parseInt(imageWidth) : undefined}
                  disabled={disabled}
                  aria-label="Set image width"
                  size="M"
                  min={0}
                  step={1}
                />
              </Box>
            </SettingGroup>

            {/* Height Setting */}
            <SettingGroup width="100%">
              <Tooltip label="Height">
                <SettingIcon>
                  <Box fontWeight="bold" fontSize="18px">
                    H
                  </Box>
                </SettingIcon>
              </Tooltip>
              <Box flex="1">
                <NumberInput
                  placeholder="Height"
                  name="height"
                  onValueChange={(value) =>
                    onSettingChange(
                      'imageHeight',
                      value !== undefined ? value.toString() : null,
                      breakpoint
                    )
                  }
                  value={imageHeight ? parseInt(imageHeight) : undefined}
                  disabled={disabled}
                  aria-label="Set image height"
                  size="M"
                  min={0}
                  step={1}
                />
              </Box>
            </SettingGroup>
          </Flex>

          {/* Aspect Ratio Lock Toggle in the same row */}
          <Flex alignItems="center">
            <Tooltip
              label={imageAspectRatioLocked ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
            >
              <IconButton
                onClick={() =>
                  onSettingChange('imageAspectRatioLocked', !imageAspectRatioLocked, breakpoint)
                }
                label={imageAspectRatioLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                disabled={disabled}
                variant={imageAspectRatioLocked ? 'secondary' : 'ghost'}
              >
                <Link />
              </IconButton>
            </Tooltip>
          </Flex>
        </Flex>
      </ViewportSettings>
    );
  }

  if (isSeparator) {
    return (
      <ViewportSettings $isActive={isActive}>
        {/* Separator Size Setting */}
        <SettingGroup width="100%">
          <Tooltip label="Separator Size">
            <SettingIcon>
              <SeparatorSizeIcon />
            </SettingIcon>
          </Tooltip>
          <Box flex="1">
            <NumberInput
              placeholder="Size"
              name="separatorSize"
              onValueChange={(value) => onSettingChange('separatorSize', value ?? null, breakpoint)}
              value={separatorSize || undefined}
              disabled={disabled}
              aria-label="Set separator size"
              size="M"
              min={0}
              max={100}
              step={1}
            />
          </Box>
        </SettingGroup>

        {/* Separator Length Setting */}
        <SettingGroup width="100%">
          <Tooltip label="Separator Length">
            <SettingIcon>
              <SeparatorLengthIcon />
            </SettingIcon>
          </Tooltip>
          <Box flex="1">
            <NumberInput
              placeholder="Length"
              name="separatorLength"
              onValueChange={(value) =>
                onSettingChange('separatorLength', value ?? null, breakpoint)
              }
              value={separatorLength || undefined}
              disabled={disabled}
              aria-label="Set separator length"
              size="M"
              min={0}
              max={100}
              step={1}
            />
          </Box>
        </SettingGroup>

        {/* Separator Orientation Setting */}
        <SettingGroup width="100%">
          <Tooltip label="Separator Orientation">
            <SettingIcon>
              <SeparatorOrientationIcon />
            </SettingIcon>
          </Tooltip>
          <SelectWrapper flex="1">
            <SingleSelect
              placeholder="Orientation"
              onChange={(value) => onSettingChange('separatorOrientation', value, breakpoint)}
              value={separatorOrientation || ''}
              disabled={disabled}
              aria-label="Select separator orientation"
              size="S"
            >
              {separatorOrientationOptions.map((option) => (
                <SingleSelectOption key={option.value} value={option.value}>
                  {option.label}
                </SingleSelectOption>
              ))}
            </SingleSelect>
          </SelectWrapper>
        </SettingGroup>
      </ViewportSettings>
    );
  }

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
            autoComplete="off"
            autocomplete={{ type: 'none' }}
            placeholder="Font Size"
            aria-label="Select or create font size"
            value={fontSize || ''}
            onChange={(value) => onSettingChange('fontSize', value, breakpoint)}
            creatable={isFontSizeValid}
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
            autoComplete="off"
            autocomplete={{ type: 'none' }}
            placeholder="Line Height"
            aria-label="Select or set line height"
            value={fontLeading || ''}
            onChange={(value) => onSettingChange('fontLeading', value, breakpoint)}
            creatable={isFontLeadingValid}
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
            autoComplete="off"
            autocomplete={{ type: 'none' }}
            placeholder="Letter Spacing"
            aria-label="Select or set letter spacing"
            value={fontTracking || ''}
            onChange={(value) => onSettingChange('fontTracking', value, breakpoint)}
            creatable={isFontTrackingValid}
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
