# Changelog

All notable changes to the strapi-plugin-rich-text-blocks-extended plugin will be documented in this file.

## [1.2.0]

### Added

- Full image block functionality with media library integration
  - Select single or multiple images from media library
  - Upload new images directly from the editor
  - Organize images in folders
  - Complete media library features within the rich text editor
  - Integration with `strapi-plugin-media-extended` for enhanced functionality

### Changed

- Image blocks now work seamlessly in custom field contexts
- Removed previous limitation regarding media library integration

### Dependencies

- Added `strapi-plugin-media-extended` as a required dependency for image block functionality

## [1.1.0]

### Added

- Separator block type with advanced customization options
  - Style options: solid, dashed, dotted, double
  - Color selection from available palette
  - Viewport-specific settings for responsive design:
    - Size (thickness): 0-100
    - Length (width percentage): 0-100%
    - Orientation: horizontal/vertical

## [1.0.6]

### Added

- Uppercase text formatting modifier (AA button in toolbar)
- Superscript text formatting modifier (sup button in toolbar)
- Subscript text formatting modifier (sub button in toolbar)

### Fixed

- Improved typing experience by fixing editor lag issues
- Optimized performance for better responsiveness during text input

## [1.0.2] - [1.0.5]

### Fixed

- Resolved critical React hook call errors
- Fixed issue with hooks being called outside of component hierarchy
- Enhanced editor performance by ensuring proper hook usage
- Fixed styled-components warnings for dynamically created components
- Performance optimization for the editor component
- Improved typing responsiveness by optimizing hook implementations
- Fixed "Invalid hook call" error in the Code.tsx component
- Resolved hook usage issues in withStrapiSchema.ts
- Updated documentation for proper installation and configuration

### Added

- Uppercase text formatting feature (using Ctrl/Cmd+A keyboard shortcut or AA button)

## [1.0.1]

### Added

- Initial stable release
- Customizable font families
- Custom color palettes
- Viewport options for responsive design
- Font size customization
- Line height adjustments
- Letter spacing control
- Text alignment options
- On-the-fly custom value creation
- Expandable editor interface
