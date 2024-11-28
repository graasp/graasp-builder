import {
  ItemLoginSchema,
  ItemLoginSchemaFactory,
  ItemLoginSchemaStatus,
  ItemLoginSchemaType,
  PackedItem,
} from '@graasp/sdk';

export const addItemLoginSchema = (
  item: PackedItem,
  itemLoginSchemaType: ItemLoginSchemaType,
  status = ItemLoginSchemaStatus.Active,
): PackedItem & { itemLoginSchema: ItemLoginSchema } => ({
  ...item,
  itemLoginSchema: ItemLoginSchemaFactory({
    item,
    type: itemLoginSchemaType,
    status,
  }),
});
