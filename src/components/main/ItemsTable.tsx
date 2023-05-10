import { ColDef, Column, IRowDragItem } from 'ag-grid-community';
import { List } from 'immutable';

import { FC, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
  DiscriminatedItem,
  Item,
  ItemMembership,
  ItemType,
  getFolderExtra,
  getShortcutExtra,
} from '@graasp/sdk';
import { ItemRecord, ResultOfRecord } from '@graasp/sdk/frontend';
import { BUILDER, COMMON } from '@graasp/translations';
import { Table as GraaspTable } from '@graasp/ui/dist/table';

import { ITEMS_TABLE_CONTAINER_HEIGHT } from '../../config/constants';
import i18n, {
  useBuilderTranslation,
  useCommonTranslation,
  useEnumsTranslation,
} from '../../config/i18n';
import { buildItemPath } from '../../config/paths';
import { hooks, mutations } from '../../config/queryClient';
import { buildItemsTableRowId } from '../../config/selectors';
import { formatDate } from '../../utils/date';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import FolderDescription from '../item/FolderDescription';
import ActionsCellRenderer from '../table/ActionsCellRenderer';
import BadgesCellRenderer, { ItemsStatuses } from '../table/BadgesCellRenderer';
import NameCellRenderer from '../table/ItemNameCellRenderer';
import MemberNameCellRenderer from '../table/MemberNameCellRenderer';
import ItemsToolbar from './ItemsToolbar';

const { useItem } = hooks;

type Props = {
  id?: string;
  items: List<ItemRecord>;
  manyMemberships: ResultOfRecord<ItemMembership[]>;
  itemsStatuses?: ItemsStatuses;
  tableTitle: string;
  headerElements?: JSX.Element[];
  isSearching?: boolean;
  actions?: ({ data }: { data: { id: string } }) => JSX.Element;
  ToolbarActions?: ({ selectedIds }: { selectedIds: string[] }) => JSX.Element;
  clickable?: boolean;
  defaultSortedColumn?: {
    updatedAt?: 'desc' | 'asc' | null;
    createdAt?: 'desc' | 'asc' | null;
    type?: 'desc' | 'asc' | null;
    name?: 'desc' | 'asc' | null;
  };
  isEditing?: boolean;
  showThumbnails?: boolean;
  showCreator?: boolean;
};

const ItemsTable: FC<Props> = ({
  tableTitle,
  id: tableId = '',
  items: rows = List(),
  manyMemberships,
  itemsStatuses,
  headerElements = [],
  isSearching = false,
  actions,
  ToolbarActions,
  clickable = true,
  defaultSortedColumn,
  isEditing = false,
  showThumbnails = true,
  showCreator = false,
}) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const { t: translateEnums } = useEnumsTranslation();
  const navigate = useNavigate();
  const { itemId } = useParams();
  const { data: parentItem } = useItem(itemId);
  const { data: member } = useCurrentUserContext();

  const { mutate: editItem } = mutations.useEditItem();

  const noStatusesToShow = !Object.values(itemsStatuses)
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
  }: {
    column: Column;
    data: DiscriminatedItem;
  }) => {
    if (column.getColId() !== 'actions') {
      let targetId = data.id;

      // redirect to target if shortcut
      if (data.type === ItemType.SHORTCUT) {
        targetId = getShortcutExtra(data.extra).target;
      }
      navigate(buildItemPath(targetId));
    }
  };

  const hasOrderChanged = (rowIds: string[]) => {
    if (parentItem.type === ItemType.FOLDER) {
      const { childrenOrder = List<string>() } =
        getFolderExtra(parentItem.extra) || {};
      return (
        rowIds.length !== childrenOrder.size ||
        !childrenOrder.every((id, i) => id === rowIds[i])
      );
    }
    return true;
  };

  const onDragEnd = (displayRows: { data: Item }[]) => {
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

  const dateColumnFormatter = ({ value }: { value: Date }) =>
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
  });

  const BadgesComponent = BadgesCellRenderer({
    itemsStatuses,
  });

  // never changes, so we can use useMemo
  const columnDefs = useMemo(() => {
    const columns: ColDef[] = [
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

    if (showCreator) {
      columns.splice(2, 0, {
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
      });
    }
    return columns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showCreator,
    translateBuilder,
    defaultSortedColumn,
    ActionComponent,
    BadgesComponent,
    actions,
    showThumbnails,
  ]);

  const countTextFunction = (selected: string[]) =>
    translateBuilder(BUILDER.ITEMS_TABLE_SELECTION_TEXT, {
      count: selected.length,
    });

  return (
    <>
      <ItemsToolbar title={tableTitle} headerElements={headerElements} />
      {itemId && <FolderDescription isEditing={isEditing} itemId={itemId} />}
      <GraaspTable
        id={tableId}
        columnDefs={columnDefs}
        tableHeight={ITEMS_TABLE_CONTAINER_HEIGHT}
        rowData={rows.toJS() as DiscriminatedItem[]}
        emptyMessage={translateBuilder(BUILDER.ITEMS_TABLE_EMPTY_MESSAGE)}
        onDragEnd={onDragEnd}
        onCellClicked={onCellClicked}
        getRowId={getRowNodeId}
        isClickable={clickable}
        enableDrag={canDrag()}
        rowDragText={itemRowDragText}
        ToolbarActions={ToolbarActions}
        countTextFunction={countTextFunction}
      />
    </>
  );
};

export default ItemsTable;
