import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import NewItemButton from './NewItemButton';
import DeleteButton from '../common/DeleteButton';
import { ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID } from '../../config/selectors';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
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

const TableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { t } = useTranslation();
  const { numSelected, tableTitle, selected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
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

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableTitle: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
};

TableToolbar.defaultProps = {
  tableTitle: 'Items',
};

export default TableToolbar;
