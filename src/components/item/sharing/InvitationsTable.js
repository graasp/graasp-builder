import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { Button, Table as GraaspTable } from '@graasp/ui';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../../config/queryClient';
import { PERMISSION_LEVELS } from '../../../enums';
import TableRowDeleteButton from './TableRowDeleteButton';
import {
  buildInvitationTableRowId,
  buildItemInvitationRowDeleteButtonId,
} from '../../../config/selectors';
import TableRowPermission from './TableRowPermission';
import {
  MEMBERSHIP_TABLE_HEIGHT,
  MEMBERSHIP_TABLE_ROW_HEIGHT,
} from '../../../config/constants';

const ResendInvitationRenderer = (item) => {
  const { t } = useTranslation();
  const itemId = item.get('id');
  const { mutate: resendInvitation } = useMutation(
    MUTATION_KEYS.RESEND_INVITATION,
  );
  const ChildComponent = ({ data: invitation }) => {
    const [clicked, setClicked] = useState(false);

    const resendEmail = () => {
      setClicked(true);
      resendInvitation({ itemId, id: invitation.id });
    };

    return (
      <Button variant="outlined" onClick={resendEmail} disabled={clicked}>
        {t('Resend Invitation')}
      </Button>
    );
  };
  ChildComponent.propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      itemPath: PropTypes.string.isRequired,
      permission: PropTypes.oneOf(Object.values(PERMISSION_LEVELS)).isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string,
    }).isRequired,
  };
  return ChildComponent;
};

const useStyles = makeStyles(() => ({
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  actionCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

const InvitationsTable = ({ invitations, item, emptyMessage }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { mutate: editInvitation } = useMutation(
    MUTATION_KEYS.PATCH_INVITATION,
  );
  const { mutate: postInvitations } = useMutation(
    MUTATION_KEYS.POST_INVITATIONS,
  );
  const { mutate: deleteInvitation } = useMutation(
    MUTATION_KEYS.DELETE_INVITATION,
  );

  const getRowId = ({ data }) => buildInvitationTableRowId(data.id);

  const onDelete = ({ instance }) => {
    deleteInvitation({ itemId: item.get('id'), id: instance.id });
  };

  const ActionRenderer = TableRowDeleteButton({
    item,
    onDelete,
    buildIdFunction: buildItemInvitationRowDeleteButtonId,
    tooltip: t(
      'This invitation is defined in the parent item and cannot be deleted here.',
    ),
  });

  const PermissionRenderer = TableRowPermission({
    item,
    editFunction: ({ instance, value }) => {
      editInvitation({
        id: instance.id,
        permission: value,
        itemId: item.get('id'),
      });
    },
    createFunction: ({ instance, value }) => {
      postInvitations({
        itemId: item.get('id'),
        invitations: [
          {
            email: instance.email,
            permission: value,
          },
        ],
      });
    },
  });

  const InvitationRenderer = ResendInvitationRenderer(item);

  // never changes, so we can use useMemo
  const columnDefs = useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        comparator: GraaspTable.textComparator,
        headerName: t('Mail'),
        field: 'email',
        cellClass: classes.row,
        flex: 1,
      },
      {
        headerName: t('Invitation'),
        sortable: false,
        cellRenderer: InvitationRenderer,
        cellClass: classes.row,
        flex: 1,
        field: 'email',
      },
      {
        headerName: t('Permission'),
        cellRenderer: PermissionRenderer,
        comparator: GraaspTable.textComparator,
        type: 'rightAligned',
        field: 'permission',
      },
      {
        field: 'actions',
        cellRenderer: ActionRenderer,
        headerName: t('Actions'),
        colId: 'actions',
        type: 'rightAligned',
        sortable: false,
        cellClass: classes.actionCell,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, InvitationRenderer, PermissionRenderer, ActionRenderer],
  );

  const countTextFunction = (selected) =>
    t('itemSelected', { count: selected.length });

  return (
    <GraaspTable
      columnDefs={columnDefs}
      tableHeight={MEMBERSHIP_TABLE_HEIGHT}
      rowData={invitations.toJS()}
      emptyMessage={emptyMessage}
      getRowId={getRowId}
      rowHeight={MEMBERSHIP_TABLE_ROW_HEIGHT}
      isClickable={false}
      countTextFunction={countTextFunction}
    />
  );
};

InvitationsTable.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  invitations: PropTypes.instanceOf(List).isRequired,
  emptyMessage: PropTypes.string,
};

InvitationsTable.defaultProps = {
  emptyMessage: null,
};

export default InvitationsTable;
