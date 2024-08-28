import { TableCell, Typography } from '@mui/material';

import { DiscriminatedItem, ItemMembership } from '@graasp/sdk';

import { useEnumsTranslation } from '@/config/i18n';

import { buildItemMembershipRowId } from '../../../../config/selectors';
import DeleteItemMembershipButton from './DeleteItemMembershipButton';
import { StyledTableRow } from './StyledTableRow';

const GuestItemMembershipTableRow = ({
  data,
  itemId,
}: {
  data: ItemMembership;
  itemId: DiscriminatedItem['id'];
}): JSX.Element => {
  const { t: translateEnums } = useEnumsTranslation();

  return (
    <StyledTableRow data-cy={buildItemMembershipRowId(data.id)} key={data.id}>
      <TableCell>
        <Typography noWrap fontWeight="bold">
          {data.account.name}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>{translateEnums(data.permission)}</Typography>
      </TableCell>
      <TableCell align="right">
        <DeleteItemMembershipButton itemId={itemId} data={data} />
      </TableCell>
    </StyledTableRow>
  );
};

export default GuestItemMembershipTableRow;
