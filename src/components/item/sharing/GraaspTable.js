import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import TableToolbar from '../../main/TableToolbar';
import DragCellRenderer from '../../table/DragCellRenderer';
import { DRAG_ICON_SIZE } from '../../../config/constants';
import TableNoRowsContent from './TableNoRowsContent';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& .ag-checked::after': {
      color: `${theme.palette.primary.main}!important`,
    },
  },
  table: {
    fontSize: theme.typography.fontSize,
    width: '100%',
    height: (props) => props.tableHeight,
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowClickable: {
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

const GraaspTable = ({
  id,
  tableHeight,
  rowData,
  NoRowsComponent,
  onDragEnd,
  renderActions,
  className,
  onSelectionChanged,
  columnDefs,
  isClickable,
  onCellClicked,
  getRowId,
  onRowDataChanged,
  rowSelection,
  NoSelectionToolbarComponent,
  suppressRowClickSelection,
  rowDragManaged,
  suppressCellFocus,
  rowDragText,
  enableDrag,
  rowHeight,
  emptyMessage,
}) => {
  const [gridApi, setGridApi] = useState(null);
  const [selected, setSelected] = useState([]);
  const classes = useStyles({ tableHeight });

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  // never changes, so we can use useMemo
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
    }),
    [],
  );

  const changeSelection = () => {
    setSelected(gridApi?.getSelectedRows().map((r) => r.id) ?? []);
  };

  const handleRowDataChanged = () => {
    changeSelection();
    onRowDataChanged?.();
  };

  const handleSelectionChanged = () => {
    changeSelection();
    onSelectionChanged?.();
  };

  const handleDragEnd = () => {
    // return displayed rows
    onDragEnd?.(gridApi.getModel().rowsToDisplay);
  };

  const dragColumn = {
    hide: !enableDrag,
    cellRenderer: DragCellRenderer,
    cellClass: classes.dragCell,
    headerClass: classes.dragCell,
    rowDragText,
    sortable: false,
    maxWidth: DRAG_ICON_SIZE,
  };

  return (
    <div className={classes.root}>
      <TableToolbar
        numSelected={selected.length}
        selected={selected}
        renderActions={renderActions}
        NoSelectionToolbarComponent={NoSelectionToolbarComponent}
      />
      <div
        className={clsx('ag-theme-material', classes.table, className)}
        id={id}
      >
        <AgGridReact
          columnDefs={[dragColumn, ...columnDefs]}
          rowData={rowData}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          suppressRowClickSelection={suppressRowClickSelection}
          suppressCellFocus={suppressCellFocus}
          noRowsOverlayComponentFramework={
            NoRowsComponent ?? TableNoRowsContent({ emptyMessage })
          }
          rowDragManaged={rowDragManaged}
          onRowDragEnd={handleDragEnd}
          onGridReady={onGridReady}
          onSelectionChanged={handleSelectionChanged}
          onCellClicked={isClickable ? onCellClicked : undefined}
          rowClass={clsx({
            [classes.row]: !isClickable,
            [classes.rowClickable]: isClickable,
          })}
          getRowHeight={() => rowHeight}
          getRowId={getRowId}
          onRowDataChanged={handleRowDataChanged}
          suppressRowHoverHighlight={!isClickable}
        />
      </div>
    </div>
  );
};

GraaspTable.textComparator = (text1, text2) =>
  text1.localeCompare(text2, undefined, { sensitivity: 'base' });

GraaspTable.dateComparator = (d1, d2) => new Date(d1) - new Date(d2);

GraaspTable.propTypes = {
  id: PropTypes.string,
  tableHeight: PropTypes.number,
  rowData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  NoRowsComponent: PropTypes.node,
  onDragEnd: PropTypes.func,
  renderActions: PropTypes.func,
  className: PropTypes.string,
  onSelectionChanged: PropTypes.func,
  columnDefs: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  isClickable: PropTypes.bool,
  onCellClicked: PropTypes.func,
  getRowId: PropTypes.func,
  onRowDataChanged: PropTypes.func,
  rowSelection: PropTypes.string,
  NoSelectionToolbarComponent: PropTypes.node,
  suppressCellFocus: PropTypes.bool,
  suppressRowClickSelection: PropTypes.bool,
  rowDragManaged: PropTypes.bool,
  rowDragText: PropTypes.func,
  enableDrag: PropTypes.bool,
  rowHeight: PropTypes.number,
  emptyMessage: PropTypes.string,
};

GraaspTable.defaultProps = {
  id: undefined,
  tableHeight: 'auto',
  onDragEnd: undefined,
  NoRowsComponent: undefined,
  renderActions: () => {},
  className: '',
  onSelectionChanged: undefined,
  isClickable: true,
  getRowId: undefined,
  onRowDataChanged: undefined,
  onCellClicked: undefined,
  rowSelection: 'multiple',
  NoSelectionToolbarComponent: undefined,
  suppressCellFocus: true,
  suppressRowClickSelection: true,
  rowDragManaged: true,
  enableDrag: false,
  rowDragText: undefined,
  rowHeight: undefined,
  emptyMessage: null,
};

export default GraaspTable;
