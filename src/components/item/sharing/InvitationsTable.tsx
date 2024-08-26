import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { DiscriminatedItem, Invitation, PermissionLevel } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import {
  buildInvitationTableRowId,
  buildItemInvitationRowDeleteButtonId,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import ResendInvitation from './ResendInvitation';
import TableRowDeleteButton from './TableRowDeleteButton';
import TableRowPermission from './TableRowPermission';

type Props = {
  item: DiscriminatedItem;
  invitations?: Invitation[];
  emptyMessage?: string;
  readOnly?: boolean;
};

const InvitationsTable = ({
  invitations,
  item,
  emptyMessage,
  readOnly = false,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: editInvitation } = mutations.usePatchInvitation();
  const { mutate: postInvitations } = mutations.usePostInvitations();
  const { mutate: deleteInvitation } = mutations.useDeleteInvitation();

  const onDelete = (invitation: Invitation) => {
    deleteInvitation({ itemId: item.id, id: invitation.id });
  };

  if (!invitations?.length) {
    return <Typography>{emptyMessage ?? 'empty'}</Typography>;
  }

  const changePermission =
    (invitation: Invitation) => (permission: PermissionLevel) => {
      if (invitation.item.path === item.path) {
        editInvitation({
          id: invitation.id,
          permission,
          itemId: item.id,
        });
      } else {
        postInvitations({
          itemId: item.id,
          invitations: [
            {
              email: invitation.email,
              permission,
            },
          ],
        });
      }
    };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              {translateBuilder(BUILDER.INVITATIONS_TABLE_EMAIL_HEADER)}
            </TableCell>
            <TableCell align="right">
              {translateBuilder(BUILDER.INVITATIONS_TABLE_PERMISSION_HEADER)}
            </TableCell>
            {!readOnly && (
              <TableCell align="right">
                {translateBuilder(BUILDER.INVITATIONS_TABLE_ACTIONS_HEADER)}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {invitations?.map((row) => {
            const isDisabled = item.path !== row.item.path;
            return (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                data-cy={buildInvitationTableRowId(row.id)}
              >
                <TableCell scope="row">
                  <Typography noWrap>{row.email}</Typography>
                </TableCell>
                <TableCell align="right">
                  <TableRowPermission
                    permission={row.permission}
                    changePermission={changePermission(row)}
                    readOnly={readOnly}
                  />
                </TableCell>
                {!readOnly && (
                  <TableCell
                    align="right"
                    sx={{ display: 'flex', direction: 'row' }}
                  >
                    <TableRowDeleteButton
                      onClick={() => onDelete(row)}
                      id={buildItemInvitationRowDeleteButtonId(row.id)}
                      tooltip={translateBuilder(
                        BUILDER.INVITATIONS_TABLE_CANNOT_DELETE_PARENT_TOOLTIP,
                      )}
                      disabled={isDisabled}
                    />
                    <ResendInvitation
                      invitationId={row.id}
                      itemId={item.id}
                      disabled={isDisabled}
                    />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InvitationsTable;
