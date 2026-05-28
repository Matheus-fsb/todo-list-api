import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  apiSidebar: [
    'intro',
    'setup',
    'environment',
    'database-docker',
    'architecture',
    {
      type: 'category',
      label: 'API',
      items: ['api/overview', 'api/auth', 'api/users', 'api/projects', 'api/tasks'],
    },
    {
      type: 'category',
      label: 'Módulos',
      items: ['modules/notifications'],
    },
    'testing',
    'cicd',
    'deploy',
    'operations',
  ],
};

export default sidebars;
