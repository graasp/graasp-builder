import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import ItemMenu from './ItemMenu';
import { buildItemPath } from '../../config/paths';
import {
  ORDERING,
  TABLE_MIN_WIDTH,
  ROWS_PER_PAGE_OPTIONS,
  ITEM_DATA_TYPES,
} from '../../config/constants';
import { getComparator, stableSort, getRowsForPage } from '../../utils/table';
import { formatDate } from '../../utils/date';
import NewItemButton from './NewItemButton';
import EditButton from '../common/EditButton';
import ShareButton from '../common/ShareButton';
import DeleteButton from '../common/DeleteButton';
import {
  buildItemsTableRowId,
  ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID,
  ITEMS_TABLE_EMPTY_ROW_ID,
  ITEMS_TABLE_ROW_CHECKBOX_CLASS,
} from '../../config/selectors';

const EnhancedTableHead = (props) => {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
  } = props;
  const { t } = useTranslation();
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': t('select all items') }}
            color="primary"
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : ORDERING.ASC}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === ORDERING.DESC
                    ? t('sorted descending')
                    : t('sorted ascending')}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.shape({
    visuallyHidden: PropTypes.string.isRequired,
  }).isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(Object.values(ORDERING)).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  title: {
    flex: '1 1 100%',
    display: 'flex',
    alignItems: 'center',
  },
  highlight: {
    background: theme.palette.primary.main,
    color: 'white',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { t } = useTranslation();
  const { numSelected, tableTitle, selected } = props;

  return (
    <Toolbar
      className={clsx({
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {t('nbitem selected', { numSelected })}
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {tableTitle}
          <NewItemButton fontSize="small" />
        </Typography>
      )}

      {numSelected > 0 ? (
        <DeleteButton
          id={ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID}
          color="secondary"
          itemIds={selected}
        />
      ) : null}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableTitle: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
};

EnhancedTableToolbar.defaultProps = {
  tableTitle: 'Items',
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: TABLE_MIN_WIDTH,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  selected: {
    backgroundColor: `${lighten(theme.palette.primary.main, 0.85)} !important`,
  },
  hover: {
    cursor: 'pointer',
  },
}));

const ItemsTable = ({ items: rows, tableTitle, id: tableId }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { push } = useHistory();
  const [order, setOrder] = React.useState(ORDERING.DESC);
  const [orderBy, setOrderBy] = React.useState('updatedAt');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    ROWS_PER_PAGE_OPTIONS[0],
  );

  useEffect(() => {
    // remove deleted rows from selection
    const newSelected = selected.filter(
      (id) => rows.findIndex(({ id: thisId }) => thisId === id) >= 0,
    );
    if (newSelected.length !== selected.length) {
      setSelected(newSelected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const headCells = [
    {
      id: 'name',
      numeric: false,
      label: t('Name'),
      align: 'left',
    },
    {
      id: 'type',
      numeric: false,
      label: t('Type'),
      align: 'right',
    },
    {
      id: 'createdAt',
      numeric: false,
      label: t('Created At'),
      align: 'right',
      type: ITEM_DATA_TYPES.DATE,
    },
    {
      id: 'updatedAt',
      numeric: false,
      label: t('Updated At'),
      align: 'right',
      type: ITEM_DATA_TYPES.DATE,
    },
    {
      id: 'actions',
      numeric: false,
      label: t('Actions'),
      align: 'right',
    },
  ];

  // display empty rows to maintain the table height
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.size - page * rowsPerPage);

  // order and select rows to display given the current page and the number of entries displayed
  const rowsToDisplay = getRowsForPage(
    stableSort(rows, getComparator(order, orderBy)),
    { page, rowsPerPage },
  );

  // transform rows' information into displayable information
  const mappedRows = rowsToDisplay.map(
    ({ id, name, updatedAt, createdAt, type }) => ({
      id,
      name,
      type,
      updatedAt,
      createdAt,
      actions: (
        <>
          <EditButton itemId={id} />
          <ShareButton itemId={id} />
          <DeleteButton itemIds={[id]} />
          <ItemMenu itemId={id} />
        </>
      ),
    }),
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === ORDERING.ASC;
    setOrder(isAsc ? ORDERING.DESC : ORDERING.ASC);
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    const checked =
      JSON.parse(event.target.dataset.indeterminate) || !event.target.checked;
    if (!checked) {
      const newSelecteds = mappedRows.map((n) => n.id).toJS();
      return setSelected(newSelecteds);
    }
    return setSelected([]);
  };

  const removeItemsFromSelected = (items) => {
    const newSelected = selected.filter((id) => !items.includes(id));
    setSelected(newSelected);
  };

  const addItemsInSelected = (items) => {
    const newSelected = selected.concat(items);
    setSelected(newSelected);
  };

  const handleClick = (event, id) => {
    const checked = selected.indexOf(id) !== -1;
    if (checked) {
      removeItemsFromSelected([id]);
    } else {
      addItemsInSelected([id]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowOnClick = (id) => {
    push(buildItemPath(id));
  };

  // format entry data given type
  const formatRowValue = ({ value, type }) => {
    switch (type) {
      case ITEM_DATA_TYPES.DATE:
        return formatDate(value);
      default:
        return value;
    }
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <EnhancedTableToolbar
          tableTitle={tableTitle}
          numSelected={selected.length}
          selected={selected}
        />
        <TableContainer>
          <Table
            id={tableId}
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.size}
              headCells={headCells}
            />
            <TableBody>
              {mappedRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    id={buildItemsTableRowId(row.id)}
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    classes={{
                      hover: classes.hover,
                      selected: classes.selected,
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        className={ITEMS_TABLE_ROW_CHECKBOX_CLASS}
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                        onClick={(event) => handleClick(event, row.id)}
                        color="primary"
                      />
                    </TableCell>
                    {headCells.map(({ id: field, align, type }, idx) => (
                      <TableCell
                        key={field}
                        align={align}
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        onClick={() => {
                          // do not navigate when clicking on actions
                          const shouldNavigate = idx !== headCells.length - 1;
                          if (shouldNavigate) {
                            handleRowOnClick(row.id);
                          }
                        }}
                      >
                        {formatRowValue({ value: row[field], type })}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  id={ITEMS_TABLE_EMPTY_ROW_ID}
                  style={{ height: 53 * emptyRows }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          component="div"
          count={rows.size}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

ItemsTable.propTypes = {
  items: PropTypes.instanceOf(List).isRequired,
  tableTitle: PropTypes.string.isRequired,
  id: PropTypes.string,
};

ItemsTable.defaultProps = {
  id: '',
};

export default ItemsTable;
