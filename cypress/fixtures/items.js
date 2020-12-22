export const CURRENT_USER_ID = 'some_creator_id';

const DEFAULT_ITEM = {
  description: '',
  extra: {},
  creator: CURRENT_USER_ID,
  type: 'Space',
};

export const CREATED_ITEM = {
  name: 'created item',
  type: 'Space',
  description: 'I am a newly created element',
  extra: {
    image: 'someimageurl',
  },
};

export const SIMPLE_ITEMS = [
  {
    ...DEFAULT_ITEM,
    id: 'item-id-1',
    name: 'own_item_name1',
    path: 'item_id_1',
  },
  {
    ...DEFAULT_ITEM,
    id: 'item-id-2',
    name: 'own_item_name2',
    path: 'item_id_2',
  },
  {
    ...DEFAULT_ITEM,
    id: 'item-id-3',
    name: 'own_item_name3',
    path: 'item_id_1.item_id_3',
  },
  {
    ...DEFAULT_ITEM,
    id: 'item-id-4',
    name: 'own_item_name4',
    path: 'item_id_1.item_id_4',
  },
];
