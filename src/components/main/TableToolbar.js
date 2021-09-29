import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ITEMS_TABLE_MOVE_SELECTED_ITEMS_ID,
  ITEMS_TABLE_COPY_SELECTED_ITEMS_ID,
  ITEMS_TABLE_RECYCLE_SELECTED_ITEMS_ID,
} from '../../config/selectors';
import CopyButton from './CopyButtons';
import MoveButton from '../common/MoveButton';
import RecycleButton from '../common/RecycleButton';

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

const DefaultActions = ({ selectedIds }) => (
  <>
    <MoveButton
      id={ITEMS_TABLE_MOVE_SELECTED_ITEMS_ID}
      color="secondary"
      itemIds={selectedIds}
    />
    <CopyButton
      id={ITEMS_TABLE_COPY_SELECTED_ITEMS_ID}
      color="secondary"
      itemIds={selectedIds}
    />
    <RecycleButton
      id={ITEMS_TABLE_RECYCLE_SELECTED_ITEMS_ID}
      color="secondary"
      itemIds={selectedIds}
    />
  </>
);
DefaultActions.propTypes = {
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const TableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { t } = useTranslation();
  const { numSelected, tableTitle, selected, headerElements, actions } = props;
  const renderActions = actions ?? DefaultActions;

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
        <>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {tableTitle}
          </Typography>

          {headerElements}
        </>
      )}

      {numSelected > 0 && renderActions({ selectedIds: selected })}
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableTitle: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  headerElements: PropTypes.arrayOf(PropTypes.element),
  actions: PropTypes.element,
};

TableToolbar.defaultProps = {
  tableTitle: 'Items',
  headerElements: [],
  actions: null,
};

export default TableToolbar;
