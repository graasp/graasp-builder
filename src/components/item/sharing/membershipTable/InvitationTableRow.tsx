import { TableCell, Typography } from '@mui/material';

import { DiscriminatedItem, Invitation, PermissionLevel } from '@graasp/sdk';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import {
  buildInvitationTableRowId,
  buildItemInvitationRowDeleteButtonId,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import EditPermissionButton from './EditPermissionButton';
import ResendInvitation from './ResendInvitation';
import { StyledTableRow } from './StyledTableRow';
import TableRowDeleteButton from './TableRowDeleteButton';

const InvitationTableRow = ({
  data,
  item,
}: {
  item: DiscriminatedItem;
  data: Invitation;
}): JSX.Element => {
  const { t: translateEnums } = useEnumsTranslation();
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: editInvitation } = mutations.usePatchInvitation();
  const { mutate: postInvitations } = mutations.usePostInvitations();
  const { mutate: deleteInvitation } = mutations.useDeleteInvitation();

  const changePermission = (permission: PermissionLevel) => {
    if (data.item.path === item.path) {
      editInvitation({
        id: data.id,
        permission,
        itemId: item.id,
      });
    } else {
      postInvitations({
        itemId: item.id,
        invitations: [
          {
            email: data.email,
            permission,
          },
        ],
      });
    }
  };

  return (
    <StyledTableRow id={buildInvitationTableRowId(data.id)}>
      <TableCell>
        <Typography noWrap fontWeight="bold">
          ({data.name ?? translateBuilder(BUILDER.INVITATION_NOT_REGISTER_TEXT)}
          )
        </Typography>
        <Typography noWrap variant="subtitle2">
          {data.email}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>{translateEnums(data.permission)}</Typography>
      </TableCell>
      <TableCell align="right">
        <ResendInvitation invitationId={data.id} itemId={item.id} />
        <EditPermissionButton
          permission={data.permission}
          email={data.email}
          name={data.name}
          handleUpdate={changePermission}
          allowDowngrade={data.item.path === item.path}
        />
        <TableRowDeleteButton
          id={buildItemInvitationRowDeleteButtonId(data.id)}
          tooltip={translateBuilder(BUILDER.INVITATION_DELETE_TOOLTIP)}
          onClick={() => deleteInvitation({ id: data.id, itemId: item.id })}
          disabled={data.item.path !== item.path}
        />
      </TableCell>
    </StyledTableRow>
  );
};

export default InvitationTableRow;
