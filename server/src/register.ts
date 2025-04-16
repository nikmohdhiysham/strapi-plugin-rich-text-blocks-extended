import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: "rich-text-blocks-extended",
    plugin: "rich-text-blocks-extended",
    type: "string",
    inputSize: {
      default: 12,
      isResizable: false
    }
  });
};

export default register;
