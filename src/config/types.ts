import { DiscriminatedItem } from '@graasp/sdk';

// eslint-disable-next-line no-shadow
export enum InternalItemType {
  ZIP = 'zip',
}

export type NewItemTabType = DiscriminatedItem['type'] | InternalItemType.ZIP;
export type ShowOnlyMeChangeType = (checked: boolean) => void;

// extend the Window interface with the new properties
declare global {
  interface Window {
    Cypress: boolean;
  }
}

// empty export to remove the "module" error
export {};
