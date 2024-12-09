import {
  ItemValidation,
  ItemValidationProcess,
  ItemValidationStatus,
  Tag,
  TagCategory,
} from '@graasp/sdk';

import { ItemForTest } from '../support/types';
import { PUBLISHED_ITEM } from './items';

export const SAMPLE_TAGS: Tag[] = [
  {
    id: 'e873d800-5647-442c-930d-2d677532846a',
    name: 'discipline 1',
    category: TagCategory.Discipline,
  },
  {
    id: '152ef74e-8893-4736-926e-214c17396ed3',
    name: 'level 1',
    category: TagCategory.Level,
  },
  {
    id: '352ef74e-8893-4736-926e-214c17396ed3',
    name: 'level 2',
    category: TagCategory.Level,
  },
  {
    id: 'ba7f7e3d-dc75-4070-b892-381fbf4759d9',
    name: 'resource-type-1',
    category: TagCategory.ResourceType,
  },
  {
    id: 'af7f7e3d-dc75-4070-b892-381fbf4759d5',
    name: 'resource-type-2',
    category: TagCategory.ResourceType,
  },
];

export const ITEM_WITH_TAGS: ItemForTest = {
  ...PUBLISHED_ITEM,
  settings: {
    displayCoEditors: true,
  },
  // for tests
  tags: SAMPLE_TAGS,
};

export const ITEM_WITH_TAGS_CONTEXT = {
  items: [ITEM_WITH_TAGS],
  itemValidationGroups: [
    {
      id: '65c57d69-0e59-4569-a422-f330c31c995c',
      item: ITEM_WITH_TAGS,
      createdAt: '2021-08-11T12:56:36.834Z',
      itemValidations: [
        {
          id: 'id1',
          item: ITEM_WITH_TAGS,
          // itemValidationGroup: iVG,
          process: ItemValidationProcess.BadWordsDetection,
          status: ItemValidationStatus.Success,
          result: '',
          updatedAt: new Date('2021-04-13 14:56:34.749946'),
          createdAt: new Date('2021-04-13 14:56:34.749946'),
        },
        {
          id: 'id2',
          item: ITEM_WITH_TAGS,
          // itemValidationGroup: iVG,
          process: ItemValidationProcess.ImageChecking,
          status: ItemValidationStatus.Success,
          result: '',
          updatedAt: new Date('2021-04-13 14:56:34.749946'),
          createdAt: new Date('2021-04-13 14:56:34.749946'),
        },
        // todo: fix this issue with circular inclusion of types
      ] as unknown as ItemValidation[],
    },
  ],
};
