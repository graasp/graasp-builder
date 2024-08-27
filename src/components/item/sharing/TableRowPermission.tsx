import { Typography } from '@mui/material';

import { PermissionLevel } from '@graasp/sdk';

import ItemMembershipSelect from './ItemMembershipSelect';
import type { ItemMembershipSelectProps } from './ItemMembershipSelect';

type TableRowPermissionProps = {
  readOnly?: boolean;
  changePermission: (permission: PermissionLevel) => void;
  permission?: PermissionLevel;
  allowDowngrade?: boolean;
};

const TableRowPermission = ({
  readOnly = false,
  changePermission,
  permission,
  allowDowngrade = true,
}: TableRowPermissionProps): JSX.Element => {
  const onChangePermission: ItemMembershipSelectProps['onChange'] = (e) => {
    const value = e.target.value as PermissionLevel;
    changePermission(value);
  };

  if (readOnly || (!allowDowngrade && permission === PermissionLevel.Admin)) {
    return <Typography noWrap>{permission}</Typography>;
  }
  return (
    <ItemMembershipSelect
      value={permission}
      showLabel={false}
      allowDowngrade={allowDowngrade}
      onChange={onChangePermission}
    />
  );
};
export default TableRowPermission;
