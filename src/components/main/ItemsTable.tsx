import { ColDef, IRowDragItem } from 'ag-grid-community';
import { List, RecordOf } from 'immutable';

import { FC, useCallback, useContext, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Item, ItemMembership, ItemType, Member } from '@graasp/sdk';
import { BUILDER, COMMON } from '@graasp/translations';
import { Table as GraaspTable } from '@graasp/ui/dist/table';

import { ITEMS_TABLE_CONTAINER_HEIGHT } from '../../config/constants';
import {
  useBuilderTranslation,
  useCommonTranslation,
  useEnumsTranslation,
} from '../../config/i18n';
import { buildItemPath } from '../../config/paths';
import { hooks, useMutation } from '../../config/queryClient';
import { buildItemsTableRowId } from '../../config/selectors';
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
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const { t: TranslateEnums } = useEnumsTranslation();
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
      if (data.type === ItemType.SHORTCUT) {
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
      console.error('no item id defined');
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
    params?.rowNode?.data?.name ??
    translateBuilder(BUILDER.ITEMS_TABLE_DRAG_DEFAULT_MESSAGE);

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
        headerName: translateBuilder(BUILDER.ITEMS_TABLE_NAME_HEADER),
        cellRenderer: NameCellRenderer(showThumbnails),
        flex: 4,
        comparator: GraaspTable.textComparator,
        sort: defaultSortedColumn?.name,
        field: 'name',
        tooltipField: 'name',
      },
      {
        field: 'type',
        headerName: translateBuilder(BUILDER.ITEMS_TABLE_TYPE_HEADER),
        type: 'rightAligned',
        cellRenderer: ({ data }: { data: Item }) => TranslateEnums(data.type),
        flex: 2,
        comparator: GraaspTable.textComparator,
        sort: defaultSortedColumn?.type,
      },
      {
        field: 'updatedAt',
        headerName: translateBuilder(BUILDER.ITEMS_TABLE_UPDATED_AT_HEADER),
        flex: 3,
        type: 'rightAligned',
        valueFormatter: dateColumnFormatter,
        comparator: GraaspTable.dateComparator,
        sort: defaultSortedColumn?.updatedAt,
      },
      {
        field: 'actions',
        cellRenderer: actions ?? ActionComponent,
        headerName: translateBuilder(BUILDER.ITEMS_TABLE_ACTIONS_HEADER),
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
        headerName: translateBuilder(BUILDER.ITEMS_TABLE_CREATOR_HEADER),
        colId: 'creator',
        type: 'rightAligned',
        cellRenderer: MemberNameCellRenderer({
          users: creators,
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
    creators,
    showCreator,
    translateBuilder,
    defaultSortedColumn,
    ActionComponent,
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
        rowData={rows.toJS() as Item[]}
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
