import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { MUTATION_KEYS } from '@graasp/query-client';
import { Loader, Table as GraaspTable } from '@graasp/ui';
import { hooks, useMutation } from '../../../config/queryClient';
import {
  buildItemMembershipRowDeleteButtonId,
  buildItemMembershipRowId,
} from '../../../config/selectors';
import TableRowDeleteButton from './TableRowDeleteButton';
import TableRowPermission from './TableRowPermission';
import {
  MEMBERSHIP_TABLE_HEIGHT,
  MEMBERSHIP_TABLE_ROW_HEIGHT,
} from '../../../config/constants';

const NameRenderer = (users) => {
  const ChildComponent = ({ data: membership }) => {
    const user = users?.find(({ id }) => id === membership.memberId);

    return user?.name ?? '';
  };
  return ChildComponent;
};

const EmailRenderer = (users) => {
  const ChildComponent = ({ data: membership }) => {
    const user = users?.find(({ id }) => id === membership.memberId);

    return user?.email ?? '';
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

const getRowId = ({ data }) => buildItemMembershipRowId(data.id);

const ItemMembershipsTable = ({ memberships, item, emptyMessage }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { data: users, isLoading } = hooks.useMembers(
    memberships.map(({ memberId }) => memberId),
  );

  const { mutate: deleteItemMembership } = useMutation(
    MUTATION_KEYS.DELETE_ITEM_MEMBERSHIP,
  );
  const { mutate: editItemMembership } = useMutation(
    MUTATION_KEYS.EDIT_ITEM_MEMBERSHIP,
  );
  const { mutate: shareItem } = useMutation(MUTATION_KEYS.POST_ITEM_MEMBERSHIP);

  const onDelete = ({ instance }) => {
    deleteItemMembership({ itemId: item.get('id'), id: instance.id });
  };

  const ActionRenderer = TableRowDeleteButton({
    item,
    onDelete,
    buildIdFunction: buildItemMembershipRowDeleteButtonId,
    tooltip: t(
      'This membership is defined in the parent item and cannot be deleted here.',
    ),
  });
  const PermissionRenderer = TableRowPermission({
    item,
    editFunction: ({ value, instance }) => {
      editItemMembership({
        itemId: item.get('id'),
        id: instance.id,
        permission: value,
      });
    },
    createFunction: ({ value, instance }) => {
      const email = users?.find(({ id }) => id === instance.memberId)?.email;
      shareItem({
        id: item.get('id'),
        email,
        permission: value,
      });
    },
  });
  const NameCellRenderer = NameRenderer(users);
  const EmailCellRenderer = EmailRenderer(users);

  // never changes, so we can use useMemo
  const columnDefs = useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerName: t('Mail'),
        cellRenderer: EmailCellRenderer,
        field: 'email',
        cellClass: classes.row,
        flex: 1,
      },
      {
        headerName: t('Name'),
        cellRenderer: NameCellRenderer,
        field: 'memberId',
        cellClass: classes.row,
        flex: 1,
      },
      {
        headerName: t('Permission'),
        cellRenderer: PermissionRenderer,
        comparator: GraaspTable.textComparator,
        sort: true,
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
    [
      t,
      EmailCellRenderer,
      NameCellRenderer,
      PermissionRenderer,
      ActionRenderer,
    ],
  );

  if (isLoading) {
    return <Loader />;
  }
  const countTextFunction = (selected) =>
    t('itemSelected', { count: selected.length });

  return (
    <GraaspTable
      columnDefs={columnDefs}
      tableHeight={MEMBERSHIP_TABLE_HEIGHT}
      rowData={memberships}
      getRowId={getRowId}
      rowHeight={MEMBERSHIP_TABLE_ROW_HEIGHT}
      isClickable={false}
      emptyMessage={emptyMessage}
      countTextFunction={countTextFunction}
    />
  );
};

ItemMembershipsTable.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  memberships: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  emptyMessage: PropTypes.string,
};

ItemMembershipsTable.defaultProps = {
  emptyMessage: null,
};

export default ItemMembershipsTable;
