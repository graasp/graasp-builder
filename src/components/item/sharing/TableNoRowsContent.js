import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  emptyText: {
    margin: theme.spacing(2, 0),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  actionCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

const NoRowsComponent = ({ emptyMessage, className }) => {
  const classes = useStyles();
  return (
    <Typography align="center" className={clsx(classes.emptyText, className)}>
      {emptyMessage ?? 'No rows to display'}
    </Typography>
  );
};

NoRowsComponent.propTypes = {
  className: PropTypes.string,
  emptyMessage: PropTypes.string,
};

NoRowsComponent.defaultProps = {
  className: null,
  emptyMessage: null,
};

export default NoRowsComponent;
