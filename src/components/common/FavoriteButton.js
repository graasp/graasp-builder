import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { MUTATION_KEYS } from '@graasp/query-client';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { FAVORITE_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { useMutation } from '../../config/queryClient';
import { isItemFavorite } from '../../utils/item';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { BUTTON_TYPES } from '../../config/constants';

const FavoriteButton = ({ item, type, onClick }) => {
  const { data: member } = useContext(CurrentUserContext);
  const { t } = useTranslation();
  const mutation = useMutation(MUTATION_KEYS.EDIT_MEMBER);

  const isFavorite = isItemFavorite(item, member);

  const handleFavorite = () => {
    mutation.mutate({
      id: member.id,
      extra: {
        favoriteItems: member?.extra.favoriteItems
          ? member.extra.favoriteItems.concat([item.id])
          : [item.id],
      },
    });
    onClick?.();
  };

  const handleUnfavorite = () => {
    mutation.mutate({
      id: member.id,
      extra: {
        favoriteItems: member?.extra.favoriteItems?.filter(
          (id) => id !== item.id,
        ),
      },
    });
    onClick?.();
  };

  const icon = isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />;

  const text = isFavorite ? t('Remove from Favorites') : t('Add to Favorites');
  const handler = isFavorite ? handleUnfavorite : handleFavorite;

  switch (type) {
    case BUTTON_TYPES.MENU_ITEM:
      return (
        <MenuItem
          key={text}
          onClick={handler}
          className={FAVORITE_ITEM_BUTTON_CLASS}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          {text}
        </MenuItem>
      );
    default:
    case BUTTON_TYPES.ICON_BUTTON:
      return (
        <Tooltip title={text}>
          <IconButton
            aria-label={text}
            className={FAVORITE_ITEM_BUTTON_CLASS}
            onClick={handler}
          >
            {icon}
          </IconButton>
        </Tooltip>
      );
  }
};

FavoriteButton.propTypes = {
  item: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

FavoriteButton.defaultProps = {
  type: BUTTON_TYPES.ICON_BUTTON,
  onClick: null,
};

export default FavoriteButton;
