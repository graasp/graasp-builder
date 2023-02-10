import { ItemType } from '@graasp/sdk';

// todo: use graasp sdk
export type ItemCategory = {
  id: string;
  categoryId: string;
};

// eslint-disable-next-line no-shadow
export enum InternalItemType {
  ZIP = 'zip',
}

export type NewItemTabType = ItemType | InternalItemType.ZIP;
