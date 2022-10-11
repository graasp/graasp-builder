import { USER_ITEM_ORDER } from '../config/constants';
import { ORDERING } from '../enums';

/**
 * Custum sorting function depending on a given property name
 * @param {object} a
 * @param {object} b
 * @param {string} orderBy property name to sort a and b
 * @param {string[]} idOrder id array based on user order
 */
export const descendingComparator = (a, b, orderBy, idOrder) => {
  if (orderBy === USER_ITEM_ORDER) {
    return idOrder.indexOf(a.id) - idOrder.indexOf(b.id);
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

/**
 * Return a comparator function depending on the order and the field
 * @param {string} order ascending or descending order
 * @param {string} orderBy property name used when sorting
 * @param {string[]} idOrder id array based on user order
 * @returns {function(): number}
 */
export const getComparator = (order, orderBy, idOrder = []) =>
  order === ORDERING.DESC
    ? (a, b) => descendingComparator(a, b, orderBy, idOrder)
    : (a, b) => -descendingComparator(a, b, orderBy, idOrder);

/**
 * Returns array sorted given a comparator function
 * @param {array} array
 * @param {function(): number} comparator
 * @returns {array}
 */
export const stableSort = (array, comparator) => {
  let stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis = stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

/**
 * Returns the correct portion of array given the current page number
 * @param {array} table
 * @param {number} page
 * @param {number} rowsPerPage
 * @returns {array}
 */
export const getRowsForPage = (table, { page, rowsPerPage }) =>
  table.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

export const userOrderComparator =
  (userOrder = []) =>
  (a, b) =>
    userOrder.indexOf(a.id) - userOrder.indexOf(b.id);
