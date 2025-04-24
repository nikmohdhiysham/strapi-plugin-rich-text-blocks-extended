# Strapi Plugin - Rich Text (Blocks - Extended)

An extended version of the JSON based native Strapi field "Rich Text (Blocks)" that provides enhanced customization options and features.

## Preview

![Documentation Image](https://iili.io/3MYVIqJ.gif)

## 🚀 Features

- 📝 All native Rich Text Blocks features
- 🎨 Customizable font families with presets
- 🌈 Custom color palettes
- 📱 Configurable viewport options
- 📏 Custom font sizes
- ↕️ Adjustable line heights
- ↔️ Letter spacing control
- ⬅️ Text alignment options
- ✨ On-the-fly custom values for font size, line height, and letter spacing
- 🔄 Expandable editor interface

## ⚠️ Known Limitations

Due to Strapi's custom field architecture limitations:

1. **Media Library Integration**: The image block does not work. This is because Strapi's custom fields cannot officially use special data types like media.

## ⚙️ Installation

```bash
# Using npm
npm install strapi-plugin-rich-text-blocks-extended

# Using yarn
yarn add strapi-plugin-rich-text-blocks-extended
```

## 🔧 Configuration

### Basic Settings

| Option                 | Type    | Default | Description                                  |
| ---------------------- | ------- | ------- | -------------------------------------------- |
| `disableDefaultFonts`  | boolean | false   | Enable to use custom font presets            |
| `customFontsPresets`   | string  | -       | Custom font families (format: "Label:value") |
| `disableDefaultColors` | boolean | false   | Enable to use custom color presets           |
| `customColorsPresets`  | string  | -       | Custom colors (format: "Label:#HEX")         |

Example font presets:

```
Arial:arial
Open Sans:open-sans
Times New Roman:times-new-roman
Georgia:georgia
```

Example color presets:

```
Black:#000000
White:#FFFFFF
Gray:#808080
Light Gray:#D3D3D3
Dark Gray:#A9A9A9
```

### Advanced Settings

| Option                      | Type    | Default | Description                                 |
| --------------------------- | ------- | ------- | ------------------------------------------- |
| `disableDefaultViewports`   | boolean | false   | Enable to use custom viewport presets       |
| `customViewportsPresets`    | string  | -       | Custom viewports (format: "Label:value")    |
| `disableDefaultSizes`       | boolean | false   | Enable to use custom font sizes             |
| `customSizesPresets`        | string  | -       | Custom font sizes (one per line)            |
| `disableDefaultLineHeights` | boolean | false   | Enable to use custom line heights           |
| `customLineHeightsPresets`  | string  | -       | Custom line heights (one per line)          |
| `disableDefaultTracking`    | boolean | false   | Enable to use custom letter spacing         |
| `customTrackingPresets`     | string  | -       | Custom letter spacing values (one per line) |
| `disableDefaultAlignments`  | boolean | false   | Enable to use custom alignments             |
| `customAlignmentsPresets`   | string  | -       | Custom alignments (format: "Label:value")   |

Example viewport presets:

```
Mobile:mobile
Tablet:tablet
Desktop:desktop
```

Example size presets:

```
6
8
9
10
11
12
14
16
18
24
30
48
```

Example alignment presets:

```
Left:left
Center:center
Right:right
Justify:justify
```

## 🎯 Usage

1. After installation, the plugin will be available as a custom field type in your Content-Types Builder.
2. Add a new field and select "Rich Text Blocks (Extended)" as the field type.
3. Configure the field options according to your needs using the settings above.

## 📝 Block Types

The plugin supports various block types including:

- Paragraphs
- Headings (H1-H6)
- Lists
- Links
- Images
- Quotes
- Code blocks

## 🤝 Contributing

Feel free to contribute to this plugin by:

1. Creating issues for bugs or feature requests
2. Submitting pull requests for improvements
3. Providing feedback and suggestions

## 📄 License

MIT License - Copyright (c) Jorge Pizzati
