import { H5PItemType, ItemType } from '@graasp/sdk';

import { CURRENT_USER } from './members';

// eslint-disable-next-line import/prefer-default-export
export const GRAASP_H5P_ITEM: H5PItemType = {
  id: 'ecaf1d2a-5688-11eb-ae91-0242ac130002',
  type: ItemType.H5P,
  name: 'graasp h5p',
  description: 'a description for graasp link',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  creator: CURRENT_USER,
  settings: {},
  createdAt: new Date(),
  updatedAt: new Date(),
  extra: {
    [ItemType.H5P]: {
      contentId: 'contentId',
      h5pFilePath: 'h5pFilePath',
      contentFilePath: 'contentFilePath',
    },
  },
};
