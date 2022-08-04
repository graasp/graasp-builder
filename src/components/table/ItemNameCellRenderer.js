import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { ItemIcon } from '@graasp/ui';

import { buildNameCellRendererId } from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  nameCell: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    marginLeft: theme.spacing(1),
  },
}));

const ItemNameCellRenderer = (showThumbnails) => {
  const Component = ({ data: item }) => {
    const classes = useStyles();

    const ThumbnailComponent = showThumbnails ? null : null;

    return (
      <div className={classes.nameCell} id={buildNameCellRendererId(item.id)}>
        {ThumbnailComponent ?? (
          <ItemIcon
            type={item.type}
            id={item.id}
            extra={item.extra}
            name={item.name}
          />
        )}
        <Typography noWrap className={classes.name}>
          {item.name}
        </Typography>
      </div>
    );
  };

  Component.propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      extra: PropTypes.shape({}).isRequired,
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  };

  return Component;
};

export default ItemNameCellRenderer;
