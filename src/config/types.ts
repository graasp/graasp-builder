import { DiscriminatedItem } from '@graasp/sdk';

// eslint-disable-next-line no-shadow
export enum InternalItemType {
  ZIP = 'zip',
}

export type NewItemTabType = DiscriminatedItem['type'] | InternalItemType.ZIP;
export type ShowOnlyMeChangeType = (checked: boolean) => void;
