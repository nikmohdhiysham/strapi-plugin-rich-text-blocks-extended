import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
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
        Input: async () => {
          const { Input } = await import('./components/Input');
          return Input;
        },
      },
      options: {
        base: [
          {
            name: 'options.blocks',
            type: 'json',
            intlLabel: {
              id: `${PLUGIN_ID}.options.blocks`,
              defaultMessage: 'Blocks Configuration',
            },
            description: {
              id: `${PLUGIN_ID}.options.blocks.description`,
              defaultMessage: 'Configure the available blocks for this field',
            },
          },
        ],
        advanced: [
          {
            name: 'private',
            type: 'checkbox',
            intlLabel: {
              id: `${PLUGIN_ID}.options.private`,
              defaultMessage: 'Private field',
            },
            description: {
              id: `${PLUGIN_ID}.options.private.description`,
              defaultMessage: 'This field will not show up in the API response',
            },
          },
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
