import { TableCell, Tooltip, Typography } from '@mui/material';

import {
  DiscriminatedItem,
  ItemLoginSchema,
  ItemLoginSchemaStatus,
  ItemMembership,
} from '@graasp/sdk';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

import { buildItemMembershipRowId } from '../../../../config/selectors';
import DeleteItemMembershipButton from './DeleteItemMembershipButton';
import { StyledTableRow } from './StyledTableRow';

const DISABLED_COLOR = '#a5a5a5';

const GuestItemMembershipTableRow = ({
  data,
  itemId,
  itemLoginSchema,
}: {
  data: ItemMembership;
  itemId: DiscriminatedItem['id'];
  itemLoginSchema?: ItemLoginSchema;
}): JSX.Element => {
  const { t: translateEnums } = useEnumsTranslation();
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: currentAccount } = hooks.useCurrentMember();

  let isDisabled = false;
  if (
    currentAccount?.id !== data.account.id &&
    (!itemLoginSchema ||
      itemLoginSchema.status === ItemLoginSchemaStatus.Disabled)
  ) {
    isDisabled = true;
  }

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
            sx={{ color: isDisabled ? DISABLED_COLOR : undefined }}
            noWrap
            fontWeight="bold"
          >
            {data.account.name}
          </Typography>
        </TableCell>
        <TableCell align="right">
          {isDisabled ? (
            <Typography sx={{ color: DISABLED_COLOR }}>
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
