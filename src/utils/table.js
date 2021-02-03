import { ORDERING } from '../config/constants';

export const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const getComparator = (order, orderBy) =>
  order === ORDERING.DESC
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

export const stableSort = (array, comparator) => {
  let stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis = stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export const getRowsForPage = (table, { page, rowsPerPage }) =>
  table.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
