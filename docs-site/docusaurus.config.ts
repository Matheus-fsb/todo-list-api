import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Todo List API',
  tagline: 'API de produtividade desenvolvida por Matheus',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'http://localhost:3000',
  baseUrl: '/',

  organizationName: 'todo-list-api',
  projectName: 'todo-list-api',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Todo List API',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'Documentação',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Projeto',
          items: [
            {
              label: 'Apresentação',
              to: '/docs/intro',
            },
            {
              label: 'Arquitetura',
              to: '/docs/architecture',
            },
          ],
        },
        {
          title: 'API',
          items: [
            {
              label: 'Autenticação',
              to: '/docs/api/auth',
            },
            {
              label: 'Tarefas',
              to: '/docs/api/tasks',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Matheus. Todos os direitos reservados.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
