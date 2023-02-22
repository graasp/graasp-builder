import { Typography } from '@mui/material';

import { useMemo } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { ItemRecord } from '@graasp/query-client/dist/types';
import { ItemMembership } from '@graasp/sdk';
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
  const ChildComponent = ({
    data: membership,
  }: {
    data: Pick<ItemMembership, 'memberId'>;
  }) => {
    const user = users?.find(({ id }) => id === membership.memberId);

    return <Typography noWrap>{user?.name ?? ''}</Typography>;
  };
  return ChildComponent;
};

const EmailRenderer = (users) => {
  const ChildComponent = ({
    data: membership,
  }: {
    data: Pick<ItemMembership, 'memberId'>;
  }) => {
    const user = users?.find(({ id }) => id === membership.memberId);

    return <Typography noWrap>{user?.email ?? ''}</Typography>;
  };
  return ChildComponent;
};

const getRowId = ({ data }) => buildItemMembershipRowId(data.id);

type Props = {
  item: ItemRecord;
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
  readOnly = true,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: users, isLoading } = hooks.useMembers(
    memberships.map(({ memberId }) => memberId),
  );

  const { mutate: deleteItemMembership } = useMutation<
    unknown,
    unknown,
    { itemId: string; id: string }
  >(MUTATION_KEYS.DELETE_ITEM_MEMBERSHIP);
  const { mutate: editItemMembership } = useMutation<
    unknown,
    unknown,
    Partial<ItemMembership & { itemId: string }>
  >(MUTATION_KEYS.EDIT_ITEM_MEMBERSHIP);
  const { mutate: shareItem } = useMutation<
    unknown,
    unknown,
    Partial<ItemMembership> & { email: string }
  >(MUTATION_KEYS.POST_ITEM_MEMBERSHIP);

  const onDelete = ({ instance }) => {
    deleteItemMembership({ itemId: item.id, id: instance.id });
  };

  // never changes, so we can use useMemo
  const columnDefs = useMemo(() => {
    const ActionRenderer = readOnly
      ? null
      : TableRowDeleteButtonRenderer({
          item,
          onDelete,
          buildIdFunction: buildItemMembershipRowDeleteButtonId,
          tooltip: translateBuilder(
            BUILDER.ITEM_MEMBERSHIPS_TABLE_CANNOT_DELETE_PARENT_TOOLTIP,
          ),
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
        headerName: translateBuilder(
          BUILDER.ITEM_MEMBERSHIPS_TABLE_EMAIL_HEADER,
        ),
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
        headerName: translateBuilder(
          BUILDER.ITEM_MEMBERSHIPS_TABLE_NAME_HEADER,
        ),
        cellRenderer: NameCellRenderer,
        field: 'memberId',
        cellStyle: rowStyle,
        flex: 2,
        tooltipField: 'name',
      },
      {
        headerName: translateBuilder(
          BUILDER.ITEM_MEMBERSHIPS_TABLE_PERMISSION_HEADER,
        ),
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
        headerName: translateBuilder(
          BUILDER.ITEM_MEMBERSHIPS_TABLE_ACTIONS_HEADER,
        ),
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
    translateBuilder(BUILDER.ITEMS_TABLE_SELECTION_TEXT, {
      count: selected.length,
    });

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

export default ItemMembershipsTable;
