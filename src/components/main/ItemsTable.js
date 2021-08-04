import { MUTATION_KEYS } from '@graasp/query-client';
import { Loader } from '@graasp/ui';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { ROWS_PER_PAGE_OPTIONS, USER_ITEM_ORDER } from '../../config/constants';
import { linkBuilder } from '../../config/paths';
import { hooks, useMutation } from '../../config/queryClient';
import {
  buildItemsTableRowId,
  ITEMS_TABLE_BODY,
  ITEMS_TABLE_EMPTY_ROW_ID,
  ITEMS_TABLE_ROW_CHECKBOX_CLASS,
} from '../../config/selectors';
import { ITEM_DATA_TYPES, ITEM_TYPES, ORDERING } from '../../enums';
import { formatDate } from '../../utils/date';
import { getChildrenOrderFromFolderExtra } from '../../utils/item';
import { getShortcutTarget } from '../../utils/itemExtra';
import { getComparator, getRowsForPage, stableSort } from '../../utils/table';
import DeleteButton from '../common/DeleteButton';
import DraggableTableRow from '../common/DraggableTableRow';
import DroppableTableBody from '../common/DroppableTableBody';
import EditButton from '../common/EditButton';
import ShareButton from '../common/ShareButton';
import { ItemSearchInput } from '../item/ItemSearch';
import ItemIcon from './ItemIcon';
import ItemMenu from './ItemMenu';
import TableHead from './TableHead';
import TableToolbar from './TableToolbar';
import FavoriteButton from '../common/FavoriteButton';

const { useItem } = hooks;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
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
  iconAndName: {
    display: 'flex',
    alignItems: 'center',
  },
  itemName: {
    paddingLeft: theme.spacing(1),
  },
}));

const computeReorderedIdList = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result.map((i) => i.id);
};

const ItemsTable = ({ items: rows, tableTitle, id: tableId, itemSearch }) => {
  const { itemId, groupId } = useParams();
  const { data: parentItem } = useItem(itemId);
  const { data: member, isLoading: isMemberLoading } = hooks.useCurrentMember();

  const classes = useStyles();
  const { t } = useTranslation();
  const { push } = useHistory();
  const [order, setOrder] = React.useState(ORDERING.DESC);
  const [orderBy, setOrderBy] = React.useState(USER_ITEM_ORDER);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    ROWS_PER_PAGE_OPTIONS[0],
  );

  const mutation = useMutation(MUTATION_KEYS.EDIT_ITEM);

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
    stableSort(
      rows,
      getComparator(
        order,
        orderBy,
        getChildrenOrderFromFolderExtra(parentItem),
      ),
    ),
    { page, rowsPerPage },
  );

  if (isMemberLoading) {
    return <Loader />;
  }

  // transform rows' information into displayable information
  const mappedRows = rowsToDisplay.map((item) => {
    const { id, updatedAt, name, createdAt, type, extra } = item;
    const nameAndIcon = (
      <span className={classes.iconAndName}>
        <ItemIcon type={type} extra={extra} name={name} />
        <span className={classes.itemName}>{name}</span>
      </span>
    );

    return {
      id,
      name: nameAndIcon,
      type,
      updatedAt,
      createdAt,
      extra,
      actions: (
        <>
          <FavoriteButton item={item} member={member} />
          <EditButton item={item} />
          <ShareButton itemId={id} />
          <DeleteButton itemIds={[id]} />
          <ItemMenu item={item} />
        </>
      ),
    };
  });

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

  const handleOnClickRow = ({ id, type, extra }) => {
    let targetId = id;

    // redirect to target if shortcut
    if (type === ITEM_TYPES.SHORTCUT) {
      targetId = getShortcutTarget(extra);
    }
    push(linkBuilder({ itemId: targetId, groupId }).buildItemPath);
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

  const onDragEnd = (result) => {
    if (!result.destination) return;

    mutation.mutate({
      id: itemId,
      extra: {
        folder: {
          childrenOrder: computeReorderedIdList(
            rowsToDisplay,
            result.source.index,
            result.destination.index,
          ),
        },
      },
    });
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <TableToolbar
          tableTitle={tableTitle}
          numSelected={selected.length}
          selected={selected}
          itemSearchInput={itemSearch?.input}
        />
        <TableContainer>
          <Table
            id={tableId}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <TableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.size}
              headCells={headCells}
            />
            <TableBody
              component={itemId ? DroppableTableBody(onDragEnd) : TableBody}
              id={ITEMS_TABLE_BODY}
            >
              {mappedRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    component={
                      itemId ? DraggableTableRow(row.id, index) : TableRow
                    }
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
                            handleOnClickRow(row);
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
