import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { ItemIcon, Thumbnail } from '@graasp/ui';
import { hooks } from '../../config/queryClient';
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

const NameCellRenderer = (showThumbnails) => {
  const Component = ({ data: item }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const ThumbnailComponent = showThumbnails
      ? Thumbnail({
          id: item.id,
          extra: item.extra,
          maxWidth: 30,
          maxHeight: 30,
          alt: t('small thumbnail'),
          useThumbnail: hooks.useItemThumbnail,
        })
      : null;

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
        <div className={classes.name}>{item.name}</div>
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

export default NameCellRenderer;
