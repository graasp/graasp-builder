import { List } from 'immutable';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { useTranslation } from 'react-i18next';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useHistory, useParams } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import EditButton from '../common/EditButton';
import ShareButton from '../common/ShareButton';
import DeleteButton from '../common/DeleteButton';
import ItemMenu from './ItemMenu';
import { hooks, useMutation } from '../../config/queryClient';
import { getChildrenOrderFromFolderExtra } from '../../utils/item';
import TableToolbar from './TableToolbar';
import { ItemSearchInput } from '../item/ItemSearch';
import { formatDate } from '../../utils/date';
import { ITEM_TYPES } from '../../enums';
import { getShortcutTarget } from '../../utils/itemExtra';
import { buildItemPath } from '../../config/paths';
import { stableSort, userOrderComparator } from '../../utils/table';
import { ITEMS_TABLE_CONTAINER_HEIGHT } from '../../config/constants';

const { useCurrentMember, useItem } = hooks;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  row: {
    cursor: 'pointer',
  },
}));

const ItemsTable = ({ items: rows, tableTitle, id: tableId, itemSearch }) => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const classes = useStyles();
  const { itemId } = useParams();
  const { data: parentItem } = useItem(itemId);
  const { data: member } = useCurrentMember();

  const [gridApi, setGridApi] = useState(null);
  const [selected, setSelected] = useState([]);

  const mutation = useMutation(MUTATION_KEYS.EDIT_ITEM);

  const rowsToDisplay = stableSort(
    rows,
    userOrderComparator(getChildrenOrderFromFolderExtra(parentItem)),
  );

  const mappedRows = rowsToDisplay.map((item) => {
    const { id, updatedAt, name, createdAt, type, extra } = item;
    return {
      id,
      name,
      type,
      updatedAt,
      createdAt,
      extra,
    };
  });

  const isFolder = () => Boolean(itemId);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onSelectionChanged = () => {
    setSelected(gridApi.getSelectedRows());
  };

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
    if (isFolder() && hasOrderChanged()) {
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

  const Actions = ({ data: item }) => (
    <>
      <EditButton item={item} />
      <ShareButton itemId={item.id} />
      <DeleteButton itemIds={[item.id]} />
      <ItemMenu item={item} member={member} />
    </>
  );

  Actions.propTypes = {
    data: PropTypes.shape({}).isRequired,
  };

  return (
    <div className={classes.root}>
      <TableToolbar
        tableTitle={tableTitle}
        numSelected={selected.length}
        selected={selected}
        itemSearchInput={itemSearch?.input}
      />
      <div
        className="ag-theme-material"
        style={{ height: ITEMS_TABLE_CONTAINER_HEIGHT, width: '100%' }}
      >
        <AgGridReact
          id={tableId}
          rowData={mappedRows}
          rowSelection="multiple"
          suppressRowClickSelection
          suppressCellSelection
          frameworkComponents={{ actions: Actions }}
          rowDragManaged={isFolder()}
          onRowDragEnd={onDragEnd}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          onCellClicked={onCellClicked}
          rowClass={classes.row}
        >
          <AgGridColumn
            rowDrag={isFolder()}
            checkboxSelection
            headerCheckboxSelection
            headerName={t('Name')}
            field="name"
            flex={4}
            sortable
            unSortIcon
            comparator={textComparator}
          />
          <AgGridColumn
            headerName={t('Type')}
            field="type"
            type="rightAligned"
            flex={2}
            sortable
            unSortIcon
            comparator={textComparator}
          />
          <AgGridColumn
            headerName={t('Created At')}
            field="createdAt"
            flex={3}
            type="rightAligned"
            valueFormatter={dateColumnFormatter}
            sortable
            comparator={dateComparator}
            unSortIcon
          />
          <AgGridColumn
            headerName={t('Updated At')}
            field="updatedAt"
            flex={3}
            type="rightAligned"
            valueFormatter={dateColumnFormatter}
            sortable
            comparator={dateComparator}
            unSortIcon
          />
          <AgGridColumn
            headerName={t('Actions')}
            colId="actions"
            cellRenderer="actions"
            pinned="right"
            type="rightAligned"
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
  itemSearch: PropTypes.shape({
    input: PropTypes.instanceOf(ItemSearchInput),
  }),
};

ItemsTable.defaultProps = {
  id: '',
  items: List(),
  itemSearch: null,
};

export default ItemsTable;
