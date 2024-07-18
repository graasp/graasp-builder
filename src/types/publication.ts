import { PublicationStatus } from '@graasp/sdk';

export type PublicationStatusMap<T> = {
  [status in PublicationStatus]: T;
};
