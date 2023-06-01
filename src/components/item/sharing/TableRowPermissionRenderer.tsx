import Typography from '@mui/material/Typography';

import { Item, PermissionLevel } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';

import { useIsParentInstance } from '../../../utils/item';
import ItemMembershipSelect from './ItemMembershipSelect';
import type { ItemMembershipSelectProps } from './ItemMembershipSelect';

type TableRowPermissionRendererProps<T> = {
  item: ItemRecord;
  editFunction: (args: { value: PermissionLevel; instance: T }) => void;
  createFunction: (args: { value: PermissionLevel; instance: T }) => void;
  readOnly?: boolean;
};

function TableRowPermissionRenderer<
  T extends { permission: PermissionLevel; item: Item },
>({
  item,
  editFunction,
  createFunction,
  readOnly = false,
}: TableRowPermissionRendererProps<T>): ({ data }: { data: T }) => JSX.Element {
  const ChildComponent = ({ data: instance }: { data: T }) => {
    const isParentMembership = useIsParentInstance({
      instance,
      item,
    });
    const onChangePermission: ItemMembershipSelectProps['onChange'] = (e) => {
      const value = e.target.value as PermissionLevel;
      // editing a parent's instance from a child should create a new instance
      if (isParentMembership) {
        createFunction({ value, instance });
      } else {
        editFunction({ value, instance });
      }
    };

    return readOnly ? (
      <Typography noWrap>{instance.permission}</Typography>
    ) : (
      <ItemMembershipSelect
        value={instance.permission}
        showLabel={false}
        onChange={onChangePermission}
      />
    );
  };

  return ChildComponent;
}
export default TableRowPermissionRenderer;
