import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { ItemIcon, Thumbnail } from '@graasp/ui';
import { hooks } from '../../config/queryClient';
import { buildNameCellRendererId } from '../../config/selectors';
import { getEmbeddedLinkExtra } from '../../utils/itemExtra';

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
    const { t } = useTranslation();

    const alt = t('small thumbnail');
    const defaultValueComponent = (
      <ItemIcon
        type={item.type}
        id={item.id}
        extraIcon={getEmbeddedLinkExtra(item.extra)?.icons?.[0]}
        name={item.name}
      />
    );

    return (
      <div className={classes.nameCell} id={buildNameCellRendererId(item.id)}>
        {showThumbnails && (
          <Thumbnail
            id={item.id}
            extraThumbnail={getEmbeddedLinkExtra(item.extra)?.thumbnails?.[0]}
            maxWidth={30}
            maxHeight={30}
            alt={alt}
            defaultValue={defaultValueComponent}
            useThumbnail={hooks.useItemThumbnail}
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
