import { ItemType } from "@graasp/sdk";

// todo: use graasp sdk
export type Category = {
  id: string;
  name: string;
};

export type Invitation = {
  id: string,
  email: string,
  permission: string,
  createdAt: string,
  updatedAt: string,
}

// eslint-disable-next-line no-shadow
export enum InternalItemType { ZIP = 'zip' }

export type NewItemTabType = ItemType.FOLDER | ItemType.LOCAL_FILE | ItemType.APP | ItemType.LINK | ItemType.DOCUMENT
  | ItemType.H5P | InternalItemType.ZIP
