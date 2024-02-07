import { DiscriminatedItem, PermissionLevel } from '@graasp/sdk';

export interface OutletType {
  item: DiscriminatedItem;
  permission?: PermissionLevel;
  canEdit: boolean;
}
