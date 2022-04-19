import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { Button } from '@graasp/ui';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import { useTranslation } from 'react-i18next';
import TableRow from '@material-ui/core/TableRow';
import { MUTATION_KEYS } from '@graasp/query-client';
import IconButton from '@material-ui/core/IconButton';
import { useMutation } from '../../../config/queryClient';
import { PERMISSION_LEVELS } from '../../../enums';
import ItemMembershipSelect from './ItemMembershipSelect';

const InvitationRow = ({ invitation, item }) => {
  const [clicked, setClicked] = useState(false);
  const { t } = useTranslation();
  const { mutate: deleteInvitation } = useMutation(
    MUTATION_KEYS.DELETE_INVITATION,
  );
  const { mutate: resendInvitation } = useMutation(
    MUTATION_KEYS.RESEND_INVITATION,
  );
  const { mutate: editInvitation } = useMutation(
    MUTATION_KEYS.PATCH_INVITATION,
  );
  const { mutate: postInvitations } = useMutation(
    MUTATION_KEYS.POST_INVITATIONS,
  );
  const itemId = item.get('id');

  const onClickDelete = () => {
    deleteInvitation({ itemId, id: invitation.id });
  };

  const onChangePermission = (e) => {
    const { value } = e.target;
    if (invitation.itemPath === item.get('path')) {
      editInvitation({
        itemId,
        id: invitation.id,
        permission: value,
      });
    }
    // editing a parent's invitation from a child should create a new invitation
    else {
      postInvitations({
        itemId,
        invitations: [
          {
            email: invitation.email,
            permission: value,
          },
        ],
      });
    }
  };

  const resendEmail = () => {
    setClicked(true);
    resendInvitation({ itemId, id: invitation.id });
  };

  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={invitation.id}>
      <TableCell component="th" scope="row" padding="none">
        {invitation.email}
      </TableCell>
      <TableCell align="right">
        <ItemMembershipSelect
          value={invitation.permission}
          showLabel={false}
          onChange={onChangePermission}
        />
      </TableCell>
      <TableCell align="right">
        <Button variant="outlined" onClick={resendEmail} disabled={clicked}>
          {t('Resend Invitation')}
        </Button>
      </TableCell>
      <TableCell align="right">
        <IconButton onClick={onClickDelete}>
          <CloseIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

InvitationRow.propTypes = {
  invitation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    itemPath: PropTypes.string.isRequired,
    permission: PropTypes.oneOf(Object.values(PERMISSION_LEVELS)).isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
  item: PropTypes.instanceOf(Map).isRequired,
};

const useStyles = makeStyles((theme) => ({
  emptyText: {
    margin: theme.spacing(2, 0),
  },
}));

const InvitationsTable = ({ invitations, item, emptyMessage }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const content = invitations?.size ? (
    invitations.map((row) => <InvitationRow invitation={row} item={item} />)
  ) : (
    <Typography align="center" className={classes.emptyText}>
      {emptyMessage || t('No user has access to this item.')}
    </Typography>
  );

  return (
    <TableContainer>
      <Table size="small">
        <TableBody>{content}</TableBody>
      </Table>
    </TableContainer>
  );
};

InvitationsTable.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  invitations: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  emptyMessage: PropTypes.string,
};

InvitationsTable.defaultProps = {
  emptyMessage: null,
};

export default InvitationsTable;
