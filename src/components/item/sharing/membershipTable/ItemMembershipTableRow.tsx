import { TableCell, Typography } from '@mui/material';

import {
  AccountType,
  DiscriminatedItem,
  ItemMembership,
  PermissionLevel,
} from '@graasp/sdk';

import { useEnumsTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';

import {
  buildItemMembershipRowEditButtonId,
  buildItemMembershipRowId,
} from '../../../../config/selectors';
import DeleteItemMembershipButton from './DeleteItemMembershipButton';
import EditPermissionButton from './EditPermissionButton';
import { StyledTableRow } from './StyledTableRow';

const ItemMembershipTableRow = ({
  allowDowngrade = false,
  isOnlyAdmin = false,
  item,
  data,
}: {
  data: ItemMembership;
  item: DiscriminatedItem;
  allowDowngrade?: boolean;
  isOnlyAdmin?: boolean;
}): JSX.Element => {
  const { t: translateEnums } = useEnumsTranslation();

  const { mutate: editItemMembership } = mutations.useEditItemMembership();
  const { mutate: shareItem } = mutations.usePostItemMembership();

  const changePermission = (newPermission: PermissionLevel) => {
    if (data.item.path === item.path) {
      editItemMembership({
        id: data.id,
        permission: newPermission,
        itemId: item.id,
      });
    } else {
      shareItem({
        id: item.id,
        accountId: data.account.id,
        permission: newPermission,
      });
    }
  };

  return (
    <StyledTableRow data-cy={buildItemMembershipRowId(data.id)} key={data.id}>
      <TableCell>
        <Typography noWrap fontWeight="bold">
          {data.account.name}
        </Typography>
        <Typography noWrap variant="subtitle2">
          {data.account.type === AccountType.Individual && data.account.email}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>{translateEnums(data.permission)}</Typography>
      </TableCell>
      <TableCell align="right">
        {!isOnlyAdmin && (
          <EditPermissionButton
            name={data.account.name}
            email={
              data.account.type === AccountType.Individual
                ? data.account.email
                : undefined
            }
            handleUpdate={changePermission}
            allowDowngrade={allowDowngrade}
            permission={data.permission}
            id={buildItemMembershipRowEditButtonId(data.id)}
          />
        )}
        {!isOnlyAdmin && allowDowngrade && (
          <DeleteItemMembershipButton itemId={item.id} data={data} />
        )}
      </TableCell>
    </StyledTableRow>
  );
};

export default ItemMembershipTableRow;