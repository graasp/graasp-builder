import { ColDef, IRowDragItem } from 'ag-grid-community';
import { List, RecordOf } from 'immutable';

import { FC, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Item, ItemMembership, Member } from '@graasp/sdk';
import { Table as GraaspTable } from '@graasp/ui/dist/table';

import { ITEMS_TABLE_CONTAINER_HEIGHT } from '../../config/constants';
import { buildItemPath } from '../../config/paths';
import { hooks, useMutation } from '../../config/queryClient';
import {
  ROW_DRAGGER_CLASS,
  buildItemsTableRowId,
} from '../../config/selectors';
import { ITEM_TYPES } from '../../enums';
import { formatDate } from '../../utils/date';
import { getChildrenOrderFromFolderExtra } from '../../utils/item';
import { getShortcutTarget } from '../../utils/itemExtra';
import { CurrentUserContext } from '../context/CurrentUserContext';
import FolderDescription from '../item/FolderDescription';
import ActionsCellRenderer from '../table/ActionsCellRenderer';
import NameCellRenderer from '../table/ItemNameCellRenderer';
import MemberNameCellRenderer from '../table/MemberNameCellRenderer';
import ItemsToolbar from './ItemsToolbar';

const { useItem } = hooks;

type Props = {
  items: List<RecordOf<Item>>;
  memberships: List<RecordOf<ItemMembership>>;
  tableTitle: string;
  id?: string;
  headerElements: JSX.Element[];
  isSearching?: boolean;
  actions?: JSX.Element;
  ToolbarActions?: React.FC<{
    selectedIds: string[];
  }>;
  clickable?: boolean;
  defaultSortedColumn?: {
    updatedAt: 'desc' | 'asc' | null | undefined;
    createdAt: 'desc' | 'asc' | null | undefined;
    type: 'desc' | 'asc' | null | undefined;
    name: 'desc' | 'asc' | null | undefined;
  };
  isEditing?: boolean;
  showThumbnails?: boolean;
  showCreator?: boolean;
  creators: List<RecordOf<Member>>;
};

const ItemsTable: FC<Props> = ({
  tableTitle,
  id: tableId = '',
  items: rows = List(),
  memberships = List(),
  headerElements = [],
  isSearching = false,
  actions,
  ToolbarActions,
  clickable = true,
  defaultSortedColumn,
  isEditing = false,
  showThumbnails = true,
  showCreator = false,
  creators = List(),
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { itemId } = useParams();
  const { data: parentItem } = useItem(itemId);
  const { data: member } = useContext(CurrentUserContext);

  const mutation = useMutation<
    any,
    any,
    {
      id: string;
      extra: {
        folder: {
          childrenOrder: string[];
        };
      };
    }
  >(MUTATION_KEYS.EDIT_ITEM);

  const isFolder = useCallback(() => Boolean(itemId), [itemId]);
  const canDrag = useCallback(
    () => isFolder() && !isSearching,
    [isFolder, isSearching],
  );

  const getRowNodeId = ({ data }: { data: Item }) =>
    buildItemsTableRowId(data.id);

  const onCellClicked = ({
    column,
    data,
  }: {
    column: { colId: string };
    data: Item;
  }) => {
    if (column.colId !== 'actions') {
      let targetId = data.id;

      // redirect to target if shortcut
      if (data.type === ITEM_TYPES.SHORTCUT) {
        targetId = getShortcutTarget(data.extra);
      }
      navigate(buildItemPath(targetId));
    }
  };

  const hasOrderChanged = (rowIds: string[]) => {
    const childrenOrder = getChildrenOrderFromFolderExtra(parentItem);

    return (
      rowIds.length !== childrenOrder.length ||
      !childrenOrder.every((id, i) => id === rowIds[i])
    );
  };

  const onDragEnd = (displayRows: { data: Item }[]) => {
    if (!itemId) {
      // TODO
      console.log('no item id defined');
    } else {
      const rowIds = displayRows.map((r) => r.data.id);
      if (canDrag() && hasOrderChanged(rowIds)) {
        mutation.mutate({
          id: itemId,
          extra: {
            folder: {
              childrenOrder: rowIds,
            },
          },
        });
      }
    }
  };

  const dateColumnFormatter = ({ value }: { value: string }) =>
    formatDate(value);

  const itemRowDragText = (params: IRowDragItem) =>
    params?.rowNode?.data.name ?? t('1 row');

  const ActionComponent = ActionsCellRenderer({
    memberships,
    items: rows,
    member,
  });

  // never changes, so we can use useMemo
  const columnDefs = useMemo(() => {
    const columns: ColDef[] = [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerName: t('Name'),
        cellRenderer: NameCellRenderer(showThumbnails),
        flex: 4,
        comparator: GraaspTable.textComparator,
        sort: defaultSortedColumn?.name,
        field: 'name',
        tooltipField: 'name',
      },
      {
        field: 'type',
        headerName: t('Type'),
        type: 'rightAligned',
        flex: 2,
        comparator: GraaspTable.textComparator,
        sort: defaultSortedColumn?.type,
      },
      {
        field: 'updatedAt',
        headerName: t('Updated At'),
        flex: 3,
        type: 'rightAligned',
        valueFormatter: dateColumnFormatter,
        comparator: GraaspTable.dateComparator,
        sort: defaultSortedColumn?.updatedAt,
      },
      {
        field: 'actions',
        cellRenderer: actions ?? ActionComponent,
        headerName: t('Actions'),
        colId: 'actions',
        type: 'rightAligned',
        cellStyle: {
          paddingLeft: '0!important',
          paddingRight: '0!important',
          textAlign: 'right',
        },
        sortable: false,
      },
    ];

    if (showCreator) {
      columns.splice(1, 0, {
        field: 'creator',
        flex: 3,
        headerName: t('Creator'),
        colId: 'creator',
        type: 'rightAligned',
        cellRenderer: MemberNameCellRenderer({
          users: creators,
          defaultValue: t('Unknown'),
        }),
        cellStyle: {
          display: 'flex',
          justifyContent: 'end',
        },
        sortable: false,
      });
    }
    return columns;
  }, [
    creators,
    showCreator,
    t,
    defaultSortedColumn,
    ActionComponent,
    actions,
    showThumbnails,
  ]);

  const countTextFunction = (selected: string[]) =>
    t('itemSelected', { count: selected.length });

  return (
    <>
      <ItemsToolbar title={tableTitle} headerElements={headerElements} />
      {itemId && <FolderDescription isEditing={isEditing} itemId={itemId} />}
      <GraaspTable
        id={tableId}
        columnDefs={columnDefs}
        tableHeight={ITEMS_TABLE_CONTAINER_HEIGHT}
        rowData={rows.toJS()}
        emptyMessage={t('No items')}
        onDragEnd={onDragEnd}
        onCellClicked={onCellClicked}
        getRowId={getRowNodeId}
        isClickable={clickable}
        enableDrag={canDrag()}
        rowDragText={itemRowDragText}
        ToolbarActions={ToolbarActions}
        countTextFunction={countTextFunction}
        dragClassName={ROW_DRAGGER_CLASS}
      />
    </>
  );
};

export default ItemsTable;
