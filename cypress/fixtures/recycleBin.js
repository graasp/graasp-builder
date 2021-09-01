import { PERMISSION_LEVELS } from '../../src/enums';
import { DEFAULT_FOLDER_ITEM } from './items';
import { CURRENT_USER } from './members';

const recycleBinId = 'ecafbd2a-5688-11eb-ae93-1342ac130002';

const MEMBER_WITH_RECYCLE_BIN = {
  ...CURRENT_USER,
  extra: {
    ...CURRENT_USER.extra,
    recycleBin: {
      itemId: recycleBinId,
    },
  },
};

// eslint-disable-next-line import/prefer-default-export
export const DATABASE_WITH_RECYCLE_BIN = {
  items: [],
  recycledItems: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'recycled_item_name1',
      path: `${recycleBinId}.ecafbd2a_5688_11eb_ae93_0242ac130002`,
      extra: {},
      memberships: [
        {
          itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBER_WITH_RECYCLE_BIN.id,
        },
      ],
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
      name: 'recycled_item_name2',
      path: `${recycleBinId}.fdf09f5a_5688_11eb_ae93_0242ac130002`,
      extra: {},
      memberships: [
        {
          itemPath: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBER_WITH_RECYCLE_BIN.id,
        },
      ],
    },
  ],
  currentMember: MEMBER_WITH_RECYCLE_BIN,
};
