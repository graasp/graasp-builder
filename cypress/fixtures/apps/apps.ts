import { App, Publisher } from '@graasp/sdk';

export const APP_NAME = 'test app';
export const NEW_APP_NAME = 'my new test app';
export const CUSTOM_APP_URL = 'http://testapp.com';

export const publisher: Publisher = {
  id: 'publisher-id',
  name: 'name',
  origins: ['origin'],
  createdAt: '2021-08-11T12:56:36.834Z',
  updatedAt: '2021-08-11T12:56:36.834Z',
};

export const APPS_LIST: App[] = [
  {
    name: APP_NAME,
    url: 'http://localhost.com:3333',
    extra: {
      image:
        'https://pbs.twimg.com/profile_images/1300707321262346240/IsQAyu7q_400x400.jpg',
    },
    id: 'app-id',
    key: 'app-key',
    description: 'description',
    publisher,
    createdAt: '2021-08-11T12:56:36.834Z',
    updatedAt: '2021-08-11T12:56:36.834Z',
  },
];
