import { List } from 'immutable';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { useTranslation } from 'react-i18next';
import { MUTATION_KEYS } from '@graasp/query-client';
import { TextEditor } from '@graasp/ui';
import { useHistory, useParams } from 'react-router';
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
  tableTitle,
  id: tableId,
  headerElements,
  isSearching,
  actions,
  toolbarActions,
  clickable,
  defautSortedColumn,
}) => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const classes = useStyles();
  const { itemId } = useParams();
  const { data: parentItem } = useItem(itemId);

  const [gridApi, setGridApi] = useState(null);
  const [selected, setSelected] = useState([]);

  const mutation = useMutation(MUTATION_KEYS.EDIT_ITEM);

  const isFolder = () => Boolean(itemId);
  const canDrag = () => isFolder() && !isSearching;

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
      push(buildItemPath(targetId));
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

  const NoRowsComponent = () => <Typography>{t('No items')}</Typography>;
  const parentDescription = parentItem?.get('description');
  return (
    <div className={classes.root}>
      <TableToolbar
        tableTitle={tableTitle}
        numSelected={selected.length}
        selected={selected}
        headerElements={headerElements}
        actions={toolbarActions}
      />

      {/* description */}
      {parentDescription && <TextEditor value={parentDescription} />}

      <div
        className="ag-theme-material"
        style={{ height: ITEMS_TABLE_CONTAINER_HEIGHT, width: '100%' }}
        id={tableId}
      >
        <AgGridReact
          rowData={rows}
          rowSelection="multiple"
          suppressRowClickSelection
          suppressCellSelection
          noRowsOverlayComponentFramework={NoRowsComponent}
          frameworkComponents={{
            actions: actions ?? ActionsCellRenderer,
            nameCellRenderer: NameCellRenderer,
            dragCellRenderer: DragCellRenderer,
          }}
          rowDragManaged
          onRowDragEnd={onDragEnd}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          onCellClicked={clickable ? onCellClicked : null}
          rowClass={clickable ? classes.row : null}
          getRowNodeId={getRowNodeId}
          onRowDataChanged={onRowDataChanged}
          applyColumnDefOrder
        >
          <AgGridColumn
            hide={!canDrag()}
            cellRenderer="dragCellRenderer"
            cellClass={classes.dragCell}
            headerClass={classes.dragCell}
            rowDragText={itemRowDragText}
            maxWidth={DRAG_ICON_SIZE}
          />
          <AgGridColumn
            checkboxSelection
            headerCheckboxSelection
            headerName={t('Name')}
            field="name"
            cellRenderer="nameCellRenderer"
            flex={4}
            sortable
            comparator={textComparator}
            sort={defautSortedColumn?.name}
          />
          <AgGridColumn
            headerName={t('Type')}
            field="type"
            type="rightAligned"
            flex={2}
            sortable
            comparator={textComparator}
            sort={defautSortedColumn?.type}
          />
          <AgGridColumn
            headerName={t('Created At')}
            field="createdAt"
            flex={3}
            type="rightAligned"
            valueFormatter={dateColumnFormatter}
            sortable
            comparator={dateComparator}
            sort={defautSortedColumn?.createdAt}
          />
          <AgGridColumn
            headerName={t('Updated At')}
            field="updatedAt"
            flex={3}
            type="rightAligned"
            valueFormatter={dateColumnFormatter}
            sortable
            comparator={dateComparator}
            sort={defautSortedColumn?.updatedAt}
          />
          <AgGridColumn
            headerName={t('Actions')}
            colId="actions"
            cellRenderer="actions"
            type="rightAligned"
            cellClass={classes.actionCell}
            width={ACTION_CELL_WIDTH}
          />
        </AgGridReact>
      </div>
    </div>
  );
};

ItemsTable.propTypes = {
  items: PropTypes.instanceOf(List),
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
};

ItemsTable.defaultProps = {
  id: '',
  items: List(),
  headerElements: [],
  isSearching: false,
  actions: null,
  toolbarActions: null,
  clickable: true,
  defautSortedColumn: {},
};

export default ItemsTable;
