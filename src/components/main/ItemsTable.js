import React, { useCallback, useContext, useMemo, useState } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { useTranslation } from 'react-i18next';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useNavigate, useParams } from 'react-router';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { hooks, useMutation } from '../../config/queryClient';
import { getChildrenOrderFromFolderExtra } from '../../utils/item';
import { getShortcutTarget } from '../../utils/itemExtra';
import TableToolbar from './TableToolbar';
import { formatDate } from '../../utils/date';
import { ITEM_TYPES } from '../../enums';
import { buildItemPath } from '../../config/paths';
import {
  ACTION_CELL_WIDTH,
  DRAG_ICON_SIZE,
  ITEMS_TABLE_CONTAINER_HEIGHT,
} from '../../config/constants';
import { buildItemsTableRowId } from '../../config/selectors';
import NameCellRenderer from '../table/NameCellRenderer';
import DragCellRenderer from '../table/DragCellRenderer';
import ActionsCellRenderer from '../table/ActionsCellRenderer';
import { CurrentUserContext } from '../context/CurrentUserContext';
import FolderDescription from '../item/FolderDescription';

const { useItem } = hooks;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& .ag-checked::after': {
      color: `${theme.palette.primary.main}!important`,
    },
  },
  row: {
    cursor: 'pointer',
  },
  dragCell: {
    paddingLeft: '0!important',
    paddingRight: '0!important',
    display: 'flex',
    alignItems: 'center',
  },
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
  toolbarActions,
  clickable,
  defautSortedColumn,
  isEditing,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classes = useStyles();
  const { itemId } = useParams();
  const { data: parentItem } = useItem(itemId);
  const { data: member } = useContext(CurrentUserContext);

  const [gridApi, setGridApi] = useState(null);
  const [selected, setSelected] = useState([]);

  const mutation = useMutation(MUTATION_KEYS.EDIT_ITEM);

  const isFolder = useCallback(() => Boolean(itemId), [itemId]);
  const canDrag = useCallback(
    () => isFolder() && !isSearching,
    [isFolder, isSearching],
  );

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onSelectionChanged = () => {
    setSelected(gridApi?.getSelectedRows().map((r) => r.id) ?? []);
  };

  const onRowDataChanged = () => {
    onSelectionChanged();
  };

  const getRowNodeId = (row) => buildItemsTableRowId(row.id);

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

  const getDisplayedRowIds = () =>
    gridApi.getModel().rowsToDisplay.map((r) => r.data.id);

  const hasOrderChanged = () => {
    const rowIds = getDisplayedRowIds();
    const childrenOrder = getChildrenOrderFromFolderExtra(parentItem);

    return (
      rowIds.length !== childrenOrder.length ||
      !childrenOrder.every((id, i) => id === rowIds[i])
    );
  };

  const onDragEnd = () => {
    if (canDrag() && hasOrderChanged()) {
      mutation.mutate({
        id: itemId,
        extra: {
          folder: {
            childrenOrder: getDisplayedRowIds(),
          },
        },
      });
    }
  };

  const dateColumnFormatter = ({ value }) => formatDate(value);

  const dateComparator = (d1, d2) => new Date(d1) - new Date(d2);

  const textComparator = (text1, text2) =>
    text1.localeCompare(text2, undefined, { sensitivity: 'base' });

  const itemRowDragText = (params) => params.rowNode.data.name;

  const ActionComponent = ActionsCellRenderer({
    memberships,
    items: rows,
    member,
  });

  const NoRowsComponent = useCallback(
    () => <Typography>{t('No items')}</Typography>,
    [t],
  );

  // never changes, so we can use useMemo
  const columnDefs = useMemo(
    () => [
      {
        hide: !canDrag(),
        cellRendererFramework: DragCellRenderer,
        cellClass: classes.dragCell,
        headerClass: classes.dragCell,
        rowDragText: itemRowDragText,
        sortable: false,
        maxWidth: DRAG_ICON_SIZE,
      },
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerName: t('Name'),
        cellRendererFramework: NameCellRenderer,
        flex: 4,
        comparator: textComparator,
        sort: defautSortedColumn?.name,
        field: 'name',
      },
      {
        field: 'type',
        headerName: t('Type'),
        type: 'rightAligned',
        flex: 2,
        comparator: textComparator,
        sort: defautSortedColumn?.type,
      },
      {
        field: 'updatedAt',
        headerName: t('Updated At'),
        flex: 3,
        type: 'rightAligned',
        valueFormatter: dateColumnFormatter,
        comparator: dateComparator,
        sort: defautSortedColumn?.updatedAt,
      },
      {
        field: 'actions',
        cellRendererFramework: actions ?? ActionComponent,
        headerName: t('Actions'),
        colId: 'actions',
        type: 'rightAligned',
        cellClass: classes.actionCell,
        width: ACTION_CELL_WIDTH,
        sortable: false,
      },
    ],
    [canDrag, classes, t, defautSortedColumn, ActionComponent, actions],
  );

  // never changes, so we can use useMemo
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
    }),
    [],
  );

  return (
    <div className={classes.root}>
      <TableToolbar
        tableTitle={tableTitle}
        numSelected={selected.length}
        selected={selected}
        headerElements={headerElements}
        actions={toolbarActions}
      />

      <FolderDescription isEditing={isEditing} itemId={itemId} />

      <div
        className="ag-theme-material"
        style={{ height: ITEMS_TABLE_CONTAINER_HEIGHT, width: '100%' }}
        id={tableId}
      >
        <AgGridReact
          reactUi="true"
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={rows.toJS()}
          rowSelection="multiple"
          suppressRowClickSelection
          suppressCellSelection
          noRowsOverlayComponentFramework={NoRowsComponent}
          rowDragManaged
          onRowDragEnd={onDragEnd}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          onCellClicked={clickable ? onCellClicked : null}
          rowClass={clickable ? classes.row : null}
          getRowNodeId={getRowNodeId}
          onRowDataChanged={onRowDataChanged}
        />
      </div>
    </div>
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
  toolbarActions: PropTypes.element,
  clickable: PropTypes.bool,
  defautSortedColumn: PropTypes.shape({
    updatedAt: PropTypes.string,
    createdAt: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
  }),
  isEditing: PropTypes.bool,
};

ItemsTable.defaultProps = {
  id: '',
  items: List(),
  memberships: List(),
  headerElements: [],
  isSearching: false,
  actions: null,
  toolbarActions: null,
  clickable: true,
  defautSortedColumn: {},
  isEditing: false,
};

export default ItemsTable;
