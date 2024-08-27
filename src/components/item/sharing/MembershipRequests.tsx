import * as React from 'react';

import { Skeleton, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {
  DiscriminatedItem,
  PermissionLevel,
  SimpleMembershipRequest,
} from '@graasp/sdk';
import { DeleteButton } from '@graasp/ui';

import ErrorAlert from '@/components/common/ErrorAlert';
import { useBuilderTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

import TableRowPermission from './TableRowPermission';

type Props = { itemId: DiscriminatedItem['id'] };

const MembershipRequests = ({ itemId }: Props): JSX.Element => {
  const { data: requests, isLoading } = hooks.useMembershipRequests(itemId);
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: deleteRequest } = mutations.useDeleteMembershipRequest();
  const { mutate: shareItem } = mutations.usePostItemMembership();

  const changePermission =
    (m: SimpleMembershipRequest) => (permission: PermissionLevel) => {
      shareItem({
        id: itemId,
        email: m.member.email,
        permission,
      });
    };

  if (requests) {
    return (
      <>
        <Typography variant="h6">
          {translateBuilder('Membership Requests')}
        </Typography>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Permissions</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((row) => (
                <TableRow
                  key={row.member.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.member.name}
                  </TableCell>
                  <TableCell align="right">{row.member.email}</TableCell>
                  <TableCell align="right">
                    <TableRowPermission
                      changePermission={changePermission(row)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <DeleteButton
                      onClick={() =>
                        deleteRequest({ itemId, memberId: row.member.id })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }

  if (isLoading) {
    return <Skeleton />;
  }

  return <ErrorAlert />;
};

export default MembershipRequests;
