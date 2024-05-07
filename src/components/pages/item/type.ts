import { PackedItem, PermissionLevel } from '@graasp/sdk';

export interface OutletType {
  item: PackedItem;
  permission?: PermissionLevel;
  canWrite: boolean;
  canAdmin: boolean;
}
