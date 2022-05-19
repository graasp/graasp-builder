import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

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

const TableToolbar = ({
  numSelected,
  selected,
  renderActions,
  NoSelectionToolbarComponent,
}) => {
  const classes = useToolbarStyles();
  const { t } = useTranslation();
  const actions = renderActions?.({ selectedIds: selected });

  return (
    <>
      {numSelected > 0 ? (
        <Toolbar
          className={clsx(classes.root, {
            [classes.highlight]: numSelected > 0,
          })}
        >
          <Typography
            className={classes.title}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {t('itemSelected', { count: numSelected })}
          </Typography>

          {numSelected > 0 ? actions : null}
        </Toolbar>
      ) : (
        NoSelectionToolbarComponent
      )}
    </>
  );
};

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  renderActions: PropTypes.func,
  NoSelectionToolbarComponent: PropTypes.node,
};

TableToolbar.defaultProps = {
  renderActions: null,
  NoSelectionToolbarComponent: null,
};

export default TableToolbar;
