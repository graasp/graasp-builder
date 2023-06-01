import { ItemType } from '@graasp/sdk';

// eslint-disable-next-line no-shadow
export enum InternalItemType {
  ZIP = 'zip',
}

export type NewItemTabType = ItemType | InternalItemType.ZIP;
