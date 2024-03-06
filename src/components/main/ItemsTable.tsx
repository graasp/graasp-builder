import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  DiscriminatedItem,
  ItemMembership,
  ItemType,
  ResultOf,
  formatDate,
  getFolderExtra,
  getShortcutExtra,
} from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Table as GraaspTable } from '@graasp/ui/table';

import {
  CellClickedEvent,
  ColDef,
  IRowDragItem,
  SortChangedEvent,
} from '@ag-grid-community/core';

import { ShowOnlyMeChangeType } from '@/config/types';

import { ITEMS_TABLE_CONTAINER_HEIGHT } from '../../config/constants';
import i18n, {
  useBuilderTranslation,
  useCommonTranslation,
  useEnumsTranslation,
} from '../../config/i18n';
import { buildItemPath } from '../../config/paths';
import { hooks, mutations } from '../../config/queryClient';
import { buildItemsTableRowId } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import FolderDescription from '../item/FolderDescription';
import ActionsCellRenderer from '../table/ActionsCellRenderer';
import BadgesCellRenderer, { ItemsStatuses } from '../table/BadgesCellRenderer';
import NameCellRenderer from '../table/ItemNameCellRenderer';
import MemberNameCellRenderer from '../table/MemberNameCellRenderer';
import ItemsToolbar from './ItemsToolbar';

const { useItem } = hooks;

export type ItemsTableProps = {
  id?: string;
  items?: DiscriminatedItem[];
  manyMemberships?: ResultOf<ItemMembership[]>;
  itemsStatuses?: ItemsStatuses;
  tableTitle: string;
  headerElements?: JSX.Element[];
  isSearching?: boolean;
  actions?: ({ data }: { data: DiscriminatedItem }) => JSX.Element;
  ToolbarActions?: ({ selectedIds }: { selectedIds: string[] }) => JSX.Element;
  clickable?: boolean;
  defaultSortedColumn?: {
    updatedAt?: 'desc' | 'asc' | null;
    createdAt?: 'desc' | 'asc' | null;
    type?: 'desc' | 'asc' | null;
    name?: 'desc' | 'asc' | null;
  };
  showThumbnails?: boolean;
  canMove?: boolean;
  onShowOnlyMeChange?: ShowOnlyMeChangeType;
  showOnlyMe?: boolean;
  page?: number;
  setPage?: (p: number) => void;
  totalCount?: number;
  onSortChanged?: (e: SortChangedEvent) => void;
  pageSize?: number;
};

const ItemsTable = ({
  tableTitle,
  id: tableId = '',
  items: rows = [],
  manyMemberships,
  itemsStatuses,
  headerElements = [],
  isSearching = false,
  actions,
  ToolbarActions,
  clickable = true,
  defaultSortedColumn,
  showThumbnails = true,
  canMove = true,
  showOnlyMe,
  onShowOnlyMeChange,
  page = 1,
  setPage,
  totalCount,
  onSortChanged,
  pageSize,
}: ItemsTableProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const { t: translateEnums } = useEnumsTranslation();
  const navigate = useNavigate();

  const { itemId } = useParams();

  const { data: parentItem } = useItem(itemId);
  const { data: member } = useCurrentUserContext();

  const { mutate: editItem } = mutations.useEditItem();

  const noStatusesToShow =
    !itemsStatuses ||
    !Object.values(itemsStatuses)
      .map((obj) => Object.values(obj).some((e) => e === true))
      .some((e) => e === true);

  const isFolder = useCallback(() => Boolean(itemId), [itemId]);
  const canDrag = useCallback(
    () => isFolder() && !isSearching,
    [isFolder, isSearching],
  );

  const getRowNodeId = ({ data }: { data: DiscriminatedItem }) =>
    buildItemsTableRowId(data.id);

  const onCellClicked = ({
    column,
    data,
  }: CellClickedEvent<DiscriminatedItem, any>) => {
    if (column.getColId() !== 'actions') {
      let targetId = data?.id;

      // redirect to target if shortcut
      if (data && data.type === ItemType.SHORTCUT) {
        targetId = getShortcutExtra(data.extra)?.target;
      }
      navigate(buildItemPath(targetId));
    }
  };

  const hasOrderChanged = (rowIds: string[]) => {
    if (parentItem && parentItem.type === ItemType.FOLDER) {
      const { childrenOrder = [] } = getFolderExtra(parentItem.extra) || {};
      return (
        rowIds.length !== childrenOrder.length ||
        !childrenOrder.every((id, i) => id === rowIds[i])
      );
    }
    return true;
  };

  const onDragEnd = (displayRows: { data: DiscriminatedItem }[]) => {
    if (!itemId) {
      console.error('no item id defined');
    } else {
      const rowIds = displayRows.map((r) => r.data.id);
      if (canDrag() && hasOrderChanged(rowIds)) {
        editItem({
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
    formatDate(value, {
      locale: i18n.language,
      defaultValue: translateCommon(COMMON.UNKNOWN_DATE),
    });

  const itemRowDragText = (params: IRowDragItem) =>
    params?.rowNode?.data?.name ??
    translateBuilder(BUILDER.ITEMS_TABLE_DRAG_DEFAULT_MESSAGE);

  const ActionComponent = ActionsCellRenderer({
    manyMemberships,
    member,
    canMove,
  });

  const BadgesComponent = BadgesCellRenderer({
    itemsStatuses,
  });

  const columnDefs: ColDef[] = [
    {
      field: 'name',
      headerName: translateBuilder(BUILDER.ITEMS_TABLE_NAME_HEADER),
      headerCheckboxSelection: true,
      checkboxSelection: true,
      cellRenderer: NameCellRenderer(showThumbnails),
      flex: 4,
      comparator: GraaspTable.textComparator,
      sort: defaultSortedColumn?.name,
      tooltipField: 'name',
    },
    {
      field: 'creator',
      headerName: translateBuilder(BUILDER.ITEMS_TABLE_CREATOR_HEADER),
      colId: 'creator',
      type: 'rightAligned',
      cellRenderer: MemberNameCellRenderer({
        defaultValue: translateCommon(COMMON.MEMBER_DEFAULT_NAME),
      }),
      cellStyle: {
        display: 'flex',
        justifyContent: 'end',
      },
      sortable: false,
    },
    {
      field: 'status',
      headerName: translateBuilder(BUILDER.ITEMS_TABLE_STATUS_HEADER),
      cellRenderer: BadgesComponent,
      hide: noStatusesToShow,
      type: 'rightAligned',
      flex: 1,
      suppressAutoSize: true,
      maxWidth: 100,
      cellStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    {
      field: 'type',
      headerName: translateBuilder(BUILDER.ITEMS_TABLE_TYPE_HEADER),
      type: 'rightAligned',
      cellRenderer: ({ data }: { data: DiscriminatedItem }) =>
        translateEnums(data.type),
      minWidth: 90,
      maxWidth: 120,
      comparator: GraaspTable.textComparator,
      sort: defaultSortedColumn?.type,
    },
    {
      field: 'updatedAt',
      headerName: translateBuilder(BUILDER.ITEMS_TABLE_UPDATED_AT_HEADER),
      maxWidth: 160,
      minWidth: 80,
      type: 'rightAligned',
      valueFormatter: dateColumnFormatter,
      comparator: GraaspTable.dateComparator,
      sort: defaultSortedColumn?.updatedAt,
    },
    {
      field: 'actions',
      cellRenderer: actions ?? ActionComponent,
      suppressKeyboardEvent: GraaspTable.suppressKeyboardEventForParentCell,
      headerName: translateBuilder(BUILDER.ITEMS_TABLE_ACTIONS_HEADER),
      colId: 'actions',
      type: 'rightAligned',
      cellStyle: {
        paddingLeft: '0!important',
        paddingRight: '0!important',
        textAlign: 'right',
      },
      sortable: false,
      suppressAutoSize: true,
      // prevent ellipsis for small screens
      minWidth: 140,
    },
  ];

  const countTextFunction = (selected: string[]) =>
    translateBuilder(BUILDER.ITEMS_TABLE_SELECTION_TEXT, {
      count: selected.length,
    });

  return (
    <>
      <ItemsToolbar
        title={tableTitle}
        subTitleElement={itemId ? <FolderDescription itemId={itemId} /> : null}
        headerElements={headerElements}
        onShowOnlyMeChange={onShowOnlyMeChange}
        showOnlyMe={showOnlyMe}
      />
      <GraaspTable
        onSortChanged={onSortChanged}
        id={tableId}
        columnDefs={columnDefs}
        tableHeight={ITEMS_TABLE_CONTAINER_HEIGHT}
        rowData={rows}
        emptyMessage={translateBuilder(BUILDER.ITEMS_TABLE_EMPTY_MESSAGE)}
        onDragEnd={onDragEnd}
        onCellClicked={onCellClicked}
        getRowId={getRowNodeId}
        isClickable={clickable}
        enableDrag={canDrag()}
        // kinda duplicate props but it needs to be enabled for ui
        rowDragManaged={canDrag()}
        rowDragText={itemRowDragText}
        ToolbarActions={ToolbarActions}
        pagination
        page={Math.max(0, page - 1)}
        onPageChange={(e, newPage) => {
          setPage?.(newPage + 1);
        }}
        countTextFunction={countTextFunction}
        totalCount={totalCount}
        // has to be fixed, otherwise the pagination is false on the last page
        // rows can contain less for the last page
        pageSize={pageSize ?? rows.length}
      />
    </>
  );
};

export default ItemsTable;
