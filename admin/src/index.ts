import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import {PluginIcon} from './components/PluginIcon';

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      name: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
    });

    app.customFields.register({
      name: PLUGIN_ID,
      pluginId: PLUGIN_ID,
      type: 'json',
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.field.label`,
        defaultMessage: 'Rich Text Blocks (Extended)',
      },
      intlDescription: {
        id: `${PLUGIN_ID}.field.description`,
        defaultMessage: 'An extended version of the JSON based native strapi field "Rich Text (Blocks)"',
      },
      components: {
        Input: async () => import('./components/Input'),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: `${PLUGIN_ID}.section.basic-settings`,
              defaultMessage: "Basic Settings",
            },
            items:[
              {
                name: 'options.disableDefaultFonts',
                type: 'checkbox',
                defaultValue: true,
                intlLabel: {
                  id: `${PLUGIN_ID}.disableDefaultFonts`,
                  defaultMessage: 'Disable default fonts?',
                },
                description: {
                  id: `${PLUGIN_ID}.disableDefaultFonts.description`,
                  defaultMessage: 'If enabled, custom font presets will be used',
                },
              },
              {
                name: 'options.customFontsPresets',
                type: 'textarea',
                placeholder: {
                  id: `${PLUGIN_ID}.customFontsPresets.placeholder`,
                  defaultMessage: "Arial:arial\nHelvetica:helvetica\nTimes New Roman:times-new-roman\nGeorgia:georgia",
                },
                intlLabel: {
                  id: `${PLUGIN_ID}.customFontsPresets`,
                  defaultMessage: 'Custom font presets',
                },
                description: {
                  id: `${PLUGIN_ID}.customFontsPresets.description`,
                  defaultMessage: 'These values will override default font options. One per line.',
                },
              },
              {
                name: 'options.disableDefaultColors',
                type: 'checkbox',
                defaultValue: true,
                intlLabel: {
                  id: `${PLUGIN_ID}.disableDefaultColors`,
                  defaultMessage: 'Disable default colors?',
                },
                description: {
                  id: `${PLUGIN_ID}.disableDefaultColors.description`,
                  defaultMessage: 'If enabled, custom color presets will be used',
                },
              },
              {
                name: 'options.customColorsPresets',
                type: 'textarea',
                placeholder: {
                  id: `${PLUGIN_ID}.customColorsPresets.placeholder`,
                  defaultMessage: "Black:#000000\nWhite:#FFFFFF\nRed:#FF0000\nGreen:#00FF00",
                },
                intlLabel: {
                  id: `${PLUGIN_ID}.customColorsPresets`,
                  defaultMessage: 'Custom color presets',
                },
                description: {
                  id: `${PLUGIN_ID}.customColorsPresets.description`,
                  defaultMessage: 'These values will override default color options. One per line.',
                },
              },
            ]
          }
        ],
        advanced: [
          {
            sectionTitle: {
              id: `${PLUGIN_ID}.section.advanced-settings`,
              defaultMessage: "Advanced Settings",
            },
            items: [
              {
                name: 'options.disableDefaultViewports',
                type: 'checkbox',
                defaultValue: true,
                intlLabel: {
                    id: `${PLUGIN_ID}.disableDefaultViewports`,
                    defaultMessage: 'Disable default viewports?',
                  },
                  description: {
                    id: `${PLUGIN_ID}.disableDefaultViewports.description`,
                    defaultMessage: 'If enabled, custom viewports will be used',
                  },
                },
                {
                  name: 'options.customViewportsPresets',
                  type: 'textarea',
                  placeholder: {
                    id: `${PLUGIN_ID}.customViewportsPresets.placeholder`,
                    defaultMessage: "Mobile:mobile\nTablet:tablet\nDesktop:desktop",
                  },
                  intlLabel: {
                    id: `${PLUGIN_ID}.customViewportsPresets`,
                    defaultMessage: 'Custom viewports presets',
                  },
                  description: {
                    id: `${PLUGIN_ID}.customViewportsPresets.description`,
                    defaultMessage: 'These values will override default viewport options. One per line.',
                  },
              },
              {
                name: 'options.disableDefaultSizes',
                type: 'checkbox',
                defaultValue: true,
                intlLabel: {
                    id: `${PLUGIN_ID}.disableDefaultSizes`,
                    defaultMessage: 'Disable default sizes?',
                  },
                  description: {
                    id: `${PLUGIN_ID}.disableDefaultSizes.description`,
                    defaultMessage: 'If enabled, custom sizes will be used',
                  },
                },
                {
                  name: 'options.customSizesPresets',
                  type: 'textarea',
                  placeholder: {
                    id: `${PLUGIN_ID}.customSizesPresets.placeholder`,
                    defaultMessage: "Small:12\nMedium:14\nLarge:16\nXLarge:18",
                  },
                  intlLabel: {
                    id: `${PLUGIN_ID}.customSizesPresets`,
                    defaultMessage: 'Custom sizes presets',
                  },
                  description: {
                    id: `${PLUGIN_ID}.customSizesPresets.description`,
                    defaultMessage: 'These values will override default size options. One per line.',
                  },
              },
              {
                name: 'options.disableDefaultLineHeights',
                type: 'checkbox',
                defaultValue: true,
                intlLabel: {
                    id: `${PLUGIN_ID}.disableDefaultLineHeights`,
                    defaultMessage: 'Disable default line heights?',
                  },
                  description: {
                    id: `${PLUGIN_ID}.disableDefaultLineHeights.description`,
                    defaultMessage: 'If enabled, custom line heights will be used',
                  },
                },
                {
                  name: 'options.customLineHeightsPresets',
                  type: 'textarea',
                  placeholder: {
                    id: `${PLUGIN_ID}.customLineHeightsPresets.placeholder`,
                    defaultMessage: "Small:40\nMedium:100\nLarge:110\nXLarge:120",
                  },
                  intlLabel: {
                    id: `${PLUGIN_ID}.customLineHeightsPresets`,
                    defaultMessage: 'Custom line heights presets',
                  },
                  description: {
                    id: `${PLUGIN_ID}.customLineHeightsPresets.description`,
                    defaultMessage: 'These values will override default line height options. One per line.',
                  },
              },
              {
                name: 'options.disableDefaultAlignments',
                type: 'checkbox',
                defaultValue: true,
                intlLabel: {
                    id: `${PLUGIN_ID}.disableDefaultAlignments`,
                    defaultMessage: 'Disable default alignments?',
                  },
                  description: {
                    id: `${PLUGIN_ID}.disableDefaultAlignments.description`,
                    defaultMessage: 'If enabled, custom alignments will be used',
                  },
                },
                {
                  name: 'options.customAlignmentsPresets',
                  type: 'textarea',
                  placeholder: {
                    id: `${PLUGIN_ID}.customAlignmentsPresets.placeholder`,
                    defaultMessage: "Left:left\nCenter:center\nRight:right\nJustify:justify",
                  },
                  intlLabel: {
                    id: `${PLUGIN_ID}.customAlignmentsPresets`,
                    defaultMessage: 'Custom alignments presets',
                  },
                  description: {
                    id: `${PLUGIN_ID}.customAlignmentsPresets.description`,
                    defaultMessage: 'These values will override default alignment options. One per line.',
                  },
              }
            ]
          }
        ],
      },
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
