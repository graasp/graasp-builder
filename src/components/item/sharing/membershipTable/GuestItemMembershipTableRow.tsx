import { TableCell, Tooltip, Typography } from '@mui/material';

import {
  DiscriminatedItem,
  ItemLoginSchemaStatus,
  ItemMembership,
} from '@graasp/sdk';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import { buildItemMembershipRowId } from '../../../../config/selectors';
import DeleteItemMembershipButton from './DeleteItemMembershipButton';
import { StyledTableRow } from './StyledTableRow';

const GuestItemMembershipTableRow = ({
  data,
  itemId,
  isDisabled,
}: {
  data: ItemMembership;
  itemId: DiscriminatedItem['id'];
  isDisabled?: boolean;
}): JSX.Element => {
  const { t: translateEnums } = useEnumsTranslation();
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <Tooltip
      title={
        isDisabled
          ? translateBuilder(
              BUILDER.ITEM_LOGIN_SCHEMA_DISABLED_GUEST_ACCESS_MESSAGE,
            )
          : undefined
      }
    >
      <StyledTableRow data-cy={buildItemMembershipRowId(data.id)} key={data.id}>
        <TableCell>
          <Typography
            sx={{ color: isDisabled ? 'text.disabled' : undefined }}
            noWrap
            fontWeight="bold"
          >
            {data.account.name}
          </Typography>
        </TableCell>
        <TableCell align="right">
          {isDisabled ? (
            <Typography color="text.disabled">
              {translateEnums(ItemLoginSchemaStatus.Disabled)}
            </Typography>
          ) : (
            <Typography>{translateEnums(data.permission)}</Typography>
          )}
        </TableCell>
        <TableCell align="right">
          <DeleteItemMembershipButton itemId={itemId} data={data} />
        </TableCell>
      </StyledTableRow>
    </Tooltip>
  );
};

export default GuestItemMembershipTableRow;
