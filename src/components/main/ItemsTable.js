import React, { useCallback, useContext, useMemo } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { MUTATION_KEYS } from '@graasp/query-client';
import { Table as GraaspTable } from '@graasp/ui';
import { makeStyles } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router';
import { hooks, useMutation } from '../../config/queryClient';
import { getChildrenOrderFromFolderExtra } from '../../utils/item';
import { getShortcutTarget } from '../../utils/itemExtra';
import ItemsToolbar from './ItemsToolbar';
import { formatDate } from '../../utils/date';
import { ITEM_TYPES } from '../../enums';
import { buildItemPath } from '../../config/paths';
import { ITEMS_TABLE_CONTAINER_HEIGHT } from '../../config/constants';
import {
  buildItemsTableRowId,
  ROW_DRAGGER_CLASS,
} from '../../config/selectors';
import NameCellRenderer from '../table/ItemNameCellRenderer';
import ActionsCellRenderer from '../table/ActionsCellRenderer';
import { CurrentUserContext } from '../context/CurrentUserContext';
import FolderDescription from '../item/FolderDescription';

const { useItem } = hooks;

const useStyles = makeStyles(() => ({
  actionCell: {
    paddingLeft: '0!important',
    paddingRight: '0!important',
    textAlign: 'right',
  },
}));

const ItemsTable = ({
  items: rows,
  memberships,
  tableTitle,
  id: tableId,
  headerElements,
  isSearching,
  actions,
  ToolbarActions,
  clickable,
  defaultSortedColumn,
  isEditing,
  showThumbnails,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { itemId } = useParams();
  const classes = useStyles();
  const { data: parentItem } = useItem(itemId);
  const { data: member } = useContext(CurrentUserContext);

  const mutation = useMutation(MUTATION_KEYS.EDIT_ITEM);

  const isFolder = useCallback(() => Boolean(itemId), [itemId]);
  const canDrag = useCallback(
    () => isFolder() && !isSearching,
    [isFolder, isSearching],
  );

  const getRowNodeId = ({ data }) => buildItemsTableRowId(data.id);

  const onCellClicked = ({ column: { colId }, data: item }) => {
    if (colId !== 'actions') {
      let targetId = item.id;

      // redirect to target if shortcut
      if (item.type === ITEM_TYPES.SHORTCUT) {
        targetId = getShortcutTarget(item.extra);
      }
      navigate(buildItemPath(targetId));
    }
  };

  const hasOrderChanged = (rowIds) => {
    const childrenOrder = getChildrenOrderFromFolderExtra(parentItem);

    return (
      rowIds.length !== childrenOrder.length ||
      !childrenOrder.every((id, i) => id === rowIds[i])
    );
  };

  const onDragEnd = (displayRows) => {
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
  };

  const dateColumnFormatter = ({ value }) => formatDate(value);

  const itemRowDragText = (params) => params.rowNode.data.name;

  const ActionComponent = ActionsCellRenderer({
    memberships,
    items: rows,
    member,
  });

  // never changes, so we can use useMemo
  const columnDefs = useMemo(
    () => [
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
        cellClass: classes.actionCell,
        sortable: false,
      },
    ],
    [classes, t, defaultSortedColumn, ActionComponent, actions, showThumbnails],
  );

  const countTextFunction = (selected) =>
    t('itemSelected', { count: selected.length });

  return (
    <>
      <ItemsToolbar title={tableTitle} headerElements={headerElements} />
      <FolderDescription isEditing={isEditing} itemId={itemId} />
      <GraaspTable
        id={tableId}
        columnDefs={columnDefs}
        tableHeight={ITEMS_TABLE_CONTAINER_HEIGHT}
        rowData={rows.toJS()}
        emptyMessage={t('No items')}
        onDragEnd={onDragEnd}
        onCellClicked={onCellClicked}
        getRowId={getRowNodeId}
        clickable={clickable}
        enableDrag={canDrag()}
        rowDragText={itemRowDragText}
        ToolbarActions={ToolbarActions}
        countTextFunction={countTextFunction}
        dragClassName={ROW_DRAGGER_CLASS}
      />
    </>
  );
};

ItemsTable.propTypes = {
  items: PropTypes.instanceOf(List),
  memberships: PropTypes.instanceOf(List),
  tableTitle: PropTypes.string.isRequired,
  id: PropTypes.string,
  headerElements: PropTypes.arrayOf(PropTypes.element),
  isSearching: PropTypes.bool,
  actions: PropTypes.element,
  ToolbarActions: PropTypes.func,
  clickable: PropTypes.bool,
  defaultSortedColumn: PropTypes.shape({
    updatedAt: PropTypes.string,
    createdAt: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
  }),
  isEditing: PropTypes.bool,
  showThumbnails: PropTypes.bool,
};

ItemsTable.defaultProps = {
  id: '',
  items: List(),
  memberships: List(),
  headerElements: [],
  isSearching: false,
  actions: null,
  ToolbarActions: null,
  clickable: true,
  defaultSortedColumn: {},
  isEditing: false,
  showThumbnails: true,
};

export default ItemsTable;
