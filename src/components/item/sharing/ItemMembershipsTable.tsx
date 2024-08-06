import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import {
  DiscriminatedItem,
  ItemMembership,
  PermissionLevel,
} from '@graasp/sdk';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, mutations } from '../../../config/queryClient';
import {
  buildItemMembershipRowDeleteButtonId,
  buildItemMembershipRowId,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import DeleteItemDialog from './ConfirmMembership';
import TableRowDeleteButton from './TableRowDeleteButton';
import TableRowPermission from './TableRowPermission';

type Props = {
  item: DiscriminatedItem;
  memberships: ItemMembership[];
  emptyMessage?: string;
  showEmail?: boolean;
  readOnly?: boolean;
};

const ItemMembershipsTable = ({
  memberships,
  item,
  emptyMessage,
  showEmail = true,
  readOnly = false,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { data: currentMember } = hooks.useCurrentMember();
  const { mutate: editItemMembership } = mutations.useEditItemMembership();
  const { mutate: shareItem } = mutations.usePostItemMembership();

  const [open, setOpen] = useState(false);
  const [membershipToDelete, setMembershipToDelete] =
    useState<ItemMembership | null>(null);

  const handleClose = () => {
    setOpen(false);
  };
  const onDelete = (im: ItemMembership) => {
    setMembershipToDelete(im);
    setOpen(true);
  };

  const hasOnlyOneAdmin =
    memberships.filter((per) => per.permission === PermissionLevel.Admin)
      .length === 1;

  const changePermission =
    (im: ItemMembership) => (permission: PermissionLevel) => {
      if (im.item.path === item.path) {
        editItemMembership({
          id: im.id,
          permission,
          itemId: item.id,
        });
      } else {
        shareItem({
          id: item.id,
          email: im.member.email,
          permission,
        });
      }
    };

  if (!memberships.length) {
    return <Typography>{emptyMessage ?? 'empty'}</Typography>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {showEmail && (
              <TableCell sx={{ fontWeight: 'bold' }}>
                {translateBuilder(BUILDER.ITEM_MEMBERSHIPS_TABLE_EMAIL_HEADER)}
              </TableCell>
            )}
            <TableCell
              sx={{ fontWeight: 'bold' }}
              align={showEmail ? 'right' : 'left'}
            >
              {translateBuilder(BUILDER.ITEM_MEMBERSHIPS_TABLE_NAME_HEADER)}
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="right">
              {translateBuilder(
                BUILDER.ITEM_MEMBERSHIPS_TABLE_PERMISSION_HEADER,
              )}
            </TableCell>
            {!readOnly && (
              <TableCell sx={{ fontWeight: 'bold' }} align="right">
                {translateBuilder(
                  BUILDER.ITEM_MEMBERSHIPS_TABLE_ACTIONS_HEADER,
                )}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {memberships
            .sort((im1, im2) => (im1.member.email > im2.member.email ? 1 : -1))
            .map((row) => (
              <TableRow
                data-cy={buildItemMembershipRowId(row.id)}
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {showEmail && (
                  <TableCell component="th" scope="row">
                    <Typography noWrap>{row.member.email}</Typography>
                  </TableCell>
                )}
                <TableCell
                  component="th"
                  align={showEmail ? 'right' : 'left'}
                  scope="row"
                >
                  <Typography noWrap>{row.member.name}</Typography>
                </TableCell>
                <TableCell align="right">
                  <TableRowPermission
                    permission={row.permission}
                    changePermission={changePermission(row)}
                    readOnly={
                      readOnly ||
                      // cannot edit if is the only admin
                      (hasOnlyOneAdmin &&
                        row.permission === PermissionLevel.Admin)
                    }
                    allowDowngrade={
                      // can downgrade for same item
                      row.item.path === item.path &&
                      // cannot downgrade your own membership
                      row.member.id !== currentMember?.id
                    }
                  />
                </TableCell>
                {!readOnly && (
                  <TableCell align="right">
                    <TableRowDeleteButton
                      onClick={() => onDelete(row)}
                      id={buildItemMembershipRowDeleteButtonId(row.id)}
                      tooltip={translateBuilder(
                        BUILDER.ITEM_MEMBERSHIPS_TABLE_CANNOT_DELETE_PARENT_TOOLTIP,
                      )}
                      disabled={
                        // cannot delete if not for current item
                        row.item.path !== item.path ||
                        // cannot delete if is the only admin
                        (hasOnlyOneAdmin &&
                          row.permission === PermissionLevel.Admin)
                      }
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {open && (
        <DeleteItemDialog
          open={open}
          handleClose={handleClose}
          item={item}
          membershipToDelete={membershipToDelete}
          hasOnlyOneAdmin={
            memberships.filter(
              (per) => per.permission === PermissionLevel.Admin,
            ).length === 1
          }
        />
      )}
    </TableContainer>
  );
};

export default ItemMembershipsTable;
