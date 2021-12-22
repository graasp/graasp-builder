import { PUBLISHED_ITEM } from './items';

export const SAMPLE_CATEGORY_TYPES = [
  {
    id: '3f7b79e2-7e78-4aea-b697-2b6a6ba92e91',
    name: 'level',
  },
  {
    id: 'c344bf4f-19e0-4674-b2a2-06bb5ac6e11c',
    name: 'discipline',
  },
];

export const SAMPLE_CATEGORIES = [
  {
    id: 'e873d800-5647-442c-930d-2d677532846a',
    name: 'test_category',
    type: SAMPLE_CATEGORY_TYPES[0].id,
  },
  {
    id: '352ef74e-8893-4736-926e-214c17396ed3',
    name: 'test_category_2',
    type: SAMPLE_CATEGORY_TYPES[1].id,
  },
];

export const SAMPLE_ITEM_CATEGORIES = [
  {
    id: 'e75e1950-c5b4-4e21-95a2-c7c3bfa4072b',
    itemId: PUBLISHED_ITEM.id,
    categoryId: SAMPLE_CATEGORIES[0].id,
  },
];

export const CUSTOMIZED_TAGS = ['water', 'ice', 'temperature'];

export const ITEM_WITH_CATEGORIES = {
  ...PUBLISHED_ITEM,
  settings: {
    tags: CUSTOMIZED_TAGS,
  },
  // for tests
  categories: SAMPLE_ITEM_CATEGORIES,
};
