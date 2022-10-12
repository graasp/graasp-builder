import { Record } from 'immutable';
import PropTypes from 'prop-types';

import { Typography } from '@mui/material';

import { useMemo } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';
import { Table as GraaspTable } from '@graasp/ui/dist/table';

import {
  MEMBERSHIP_TABLE_HEIGHT,
  MEMBERSHIP_TABLE_ROW_HEIGHT,
} from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, useMutation } from '../../../config/queryClient';
import {
  buildItemMembershipRowDeleteButtonId,
  buildItemMembershipRowId,
} from '../../../config/selectors';
import TableRowDeleteButtonRenderer from './TableRowDeleteButtonRenderer';
import TableRowPermissionRenderer from './TableRowPermissionRenderer';

const rowStyle = {
  display: 'flex',
  alignItems: 'center',

  '& > div': {
    width: '100%',
  },
};

const NameRenderer = (users) => {
  const ChildComponent = ({ data: membership }) => {
    const user = users?.find(({ id }) => id === membership.memberId);

    return <Typography noWrap>{user?.name ?? ''}</Typography>;
  };
  ChildComponent.propTypes = {
    data: PropTypes.shape({
      memberId: PropTypes.string.isRequired,
    }).isRequired,
  };
  return ChildComponent;
};

const EmailRenderer = (users) => {
  const ChildComponent = ({ data: membership }) => {
    const user = users?.find(({ id }) => id === membership.memberId);

    return <Typography noWrap>{user?.email ?? ''}</Typography>;
  };
  ChildComponent.propTypes = {
    data: PropTypes.shape({
      memberId: PropTypes.string.isRequired,
    }).isRequired,
  };
  return ChildComponent;
};

const getRowId = ({ data }) => buildItemMembershipRowId(data.id);

const ItemMembershipsTable = ({
  memberships,
  item,
  emptyMessage,
  showEmail,
}) => {
  const { t } = useBuilderTranslation();
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
    deleteItemMembership({ itemId: item.id, id: instance.id });
  };

  // never changes, so we can use useMemo
  const columnDefs = useMemo(() => {
    const ActionRenderer = TableRowDeleteButtonRenderer({
      item,
      onDelete,
      buildIdFunction: buildItemMembershipRowDeleteButtonId,
      tooltip: t(BUILDER.ITEM_MEMBERSHIPS_TABLE_CANNOT_DELETE_PARENT_TOOLTIP),
    });
    const PermissionRenderer = TableRowPermissionRenderer({
      item,
      editFunction: ({ value, instance }) => {
        editItemMembership({
          itemId: item.id,
          id: instance.id,
          permission: value,
        });
      },
      createFunction: ({ value, instance }) => {
        const email = users?.find(({ id }) => id === instance.memberId)?.email;
        shareItem({
          id: item.id,
          email,
          permission: value,
        });
      },
    });
    const NameCellRenderer = NameRenderer(users);

    const columns = [];
    if (showEmail) {
      const EmailCellRenderer = EmailRenderer(users);
      columns.push({
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerName: t(BUILDER.ITEM_MEMBERSHIPS_TABLE_EMAIL_HEADER),
        cellRenderer: EmailCellRenderer,
        field: 'email',
        cellStyle: rowStyle,
        flex: 2,
        tooltipField: 'email',
        resizable: true,
      });
    }

    return columns.concat([
      {
        headerName: t(BUILDER.ITEM_MEMBERSHIPS_TABLE_NAME_HEADER),
        cellRenderer: NameCellRenderer,
        field: 'memberId',
        cellStyle: rowStyle,
        flex: 2,
        tooltipField: 'name',
      },
      {
        headerName: t(BUILDER.ITEM_MEMBERSHIPS_TABLE_PERMISSION_HEADER),
        cellRenderer: PermissionRenderer,
        comparator: GraaspTable.textComparator,
        sort: true,
        type: 'rightAligned',
        field: 'permission',
        flex: 1,
        cellStyle: {
          overflow: 'visible',
          textAlign: 'right',
        },
      },
      {
        field: 'actions',
        cellRenderer: ActionRenderer,
        headerName: t(BUILDER.ITEM_MEMBERSHIPS_TABLE_ACTIONS_HEADER),
        colId: 'actions',
        type: 'rightAligned',
        sortable: false,
        cellStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
        flex: 1,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, users, showEmail]);

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
  item: PropTypes.instanceOf(Record).isRequired,
  memberships: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  emptyMessage: PropTypes.string,
  showEmail: PropTypes.bool,
};

ItemMembershipsTable.defaultProps = {
  emptyMessage: null,
  showEmail: true,
};

export default ItemMembershipsTable;
