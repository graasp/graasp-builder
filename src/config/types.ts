import { ItemType } from '@graasp/sdk';

// todo: use graasp sdk
export type Category = {
  id: string;
  name: string;
};

// todo: use graasp sdk
export type ItemCategory = {
  id: string;
  categoryId: string;
};

export type Invitation = {
  id: string;
  email: string;
  itemPath: string;
  permission: string;
  createdAt: string;
  updatedAt: string;
};

// eslint-disable-next-line no-shadow
export enum InternalItemType {
  ZIP = 'zip',
}

export type NewItemTabType = ItemType | InternalItemType.ZIP;
