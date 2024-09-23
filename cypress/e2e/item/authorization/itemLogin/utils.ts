import { ItemLoginSchema, ItemLoginSchemaType, PackedItem } from '@graasp/sdk';

import { v4 } from 'uuid';

export const addItemLoginSchema = (
  item: PackedItem,
  itemLoginSchemaType: ItemLoginSchemaType,
): PackedItem & { itemLoginSchema: ItemLoginSchema } => ({
  ...item,
  itemLoginSchema: {
    item,
    type: itemLoginSchemaType,
    id: v4(),
    createdAt: '2021-08-11T12:56:36.834Z',
    updatedAt: '2021-08-11T12:56:36.834Z',
  },
});
