import { Category, CategoryType, ItemCategory } from '@graasp/sdk';

import { PUBLISHED_ITEM } from './items';
import { MEMBERS } from './members';

export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: 'e873d800-5647-442c-930d-2d677532846a',
    name: 'test_category',
    type: CategoryType.DISCIPLINE,
  },
  {
    id: '352ef74e-8893-4736-926e-214c17396ed3',
    name: 'test_category_2',
    type: CategoryType.LEVEL,
  },
  {
    id: 'ba7f7e3d-dc75-4070-b892-381fbf4759d9',
    name: 'language-1',
    type: CategoryType.LANGUAGE,
  },
];

export const SAMPLE_ITEM_CATEGORIES: ItemCategory[] = [
  {
    id: 'e75e1950-c5b4-4e21-95a2-c7c3bfa4072b',
    item: PUBLISHED_ITEM,
    category: SAMPLE_CATEGORIES[0],
    createdAt: new Date(), creator: MEMBERS.ANNA
  },
];

export const CUSTOMIZED_TAGS = ['water', 'ice', 'temperature'];

export const NEW_CUSTOMIZED_TAG = 'newTag';

export const ITEM_WITH_CATEGORIES = {
  ...PUBLISHED_ITEM,
  settings: {
    tags: CUSTOMIZED_TAGS,
    displayCoEditors: true,
  },
  // for tests
  categories: SAMPLE_ITEM_CATEGORIES,
};
