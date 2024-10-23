import {
  Category,
  CategoryType,
  ItemCategory,
  ItemValidation,
  ItemValidationProcess,
  ItemValidationStatus,
} from '@graasp/sdk';

import { ItemForTest } from '../support/types';
import { PUBLISHED_ITEM } from './items';
import { MEMBERS } from './members';

export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: 'e873d800-5647-442c-930d-2d677532846a',
    name: 'test_category',
    type: CategoryType.Discipline,
  },
  {
    id: '352ef74e-8893-4736-926e-214c17396ed3',
    name: 'test_category_2',
    type: CategoryType.Level,
  },
  {
    id: 'ba7f7e3d-dc75-4070-b892-381fbf4759d9',
    name: 'language-1',
    type: CategoryType.Language,
  },
  {
    id: 'af7f7e3d-dc75-4070-b892-381fbf4759d5',
    name: 'language-2',
    type: CategoryType.Language,
  },
];

export const SAMPLE_ITEM_CATEGORIES: ItemCategory[] = [
  {
    id: 'e75e1950-c5b4-4e21-95a2-c7c3bfa4072b',
    item: PUBLISHED_ITEM,
    category: SAMPLE_CATEGORIES[0],
    createdAt: '2021-08-11T12:56:36.834Z',
    creator: MEMBERS.ANNA,
  },
];

export const SAMPLE_ITEM_LANGUAGE: ItemCategory[] = [
  {
    id: 'e75e1950-c5b4-4e21-95a2-c7c3bfa4072b',
    item: PUBLISHED_ITEM,
    category: SAMPLE_CATEGORIES[2],
    createdAt: '2021-08-11T12:56:36.834Z',
    creator: MEMBERS.ANNA,
  },
];

export const CUSTOMIZED_TAGS = ['water', 'ice', 'temperature'];

export const ITEM_WITH_CATEGORIES: ItemForTest = {
  ...PUBLISHED_ITEM,
  settings: {
    tags: CUSTOMIZED_TAGS,
    displayCoEditors: true,
  },
  // for tests
  categories: SAMPLE_ITEM_CATEGORIES,
};

export const ITEM_WITH_CATEGORIES_CONTEXT = {
  items: [ITEM_WITH_CATEGORIES],
  itemValidationGroups: [
    {
      id: '65c57d69-0e59-4569-a422-f330c31c995c',
      item: ITEM_WITH_CATEGORIES,
      createdAt: '2021-08-11T12:56:36.834Z',
      itemValidations: [
        {
          id: 'id1',
          item: ITEM_WITH_CATEGORIES,
          // itemValidationGroup: iVG,
          process: ItemValidationProcess.BadWordsDetection,
          status: ItemValidationStatus.Success,
          result: '',
          updatedAt: new Date('2021-04-13 14:56:34.749946'),
          createdAt: new Date('2021-04-13 14:56:34.749946'),
        },
        {
          id: 'id2',
          item: ITEM_WITH_CATEGORIES,
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
