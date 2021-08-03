import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { Map } from 'immutable';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { MUTATION_KEYS } from '@graasp/query-client';
import { FAVORITE_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { useMutation } from '../../config/queryClient';
import { isItemFavorite } from '../../utils/item';

const FavoriteButton = ({ item, member }) => {
  const { t } = useTranslation();
  const mutation = useMutation(MUTATION_KEYS.EDIT_MEMBER);

  const isFavorite = isItemFavorite(item, member);

  const handleFavorite = () => {
    mutation.mutate({
      id: member.get('id'),
      extra: {
        favoriteItems: member?.get('extra').favoriteItems
          ? member.get('extra').favoriteItems.concat([item.id])
          : [item.id],
      },
    });
  };

  const handleUnfavorite = () => {
    mutation.mutate({
      id: member.get('id'),
      extra: {
        favoriteItems: member
          ?.get('extra')
          .favoriteItems?.filter((id) => id !== item.id),
      },
    });
  };

  return (
    <Tooltip
      title={isFavorite ? t('Remove from Favorites') : t('Add to Favorites')}
    >
      <IconButton
        aria-label="favorite"
        className={FAVORITE_ITEM_BUTTON_CLASS}
        onClick={isFavorite ? handleUnfavorite : handleFavorite}
      >
        {isFavorite ? (
          <FavoriteIcon fontSize="small" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};

FavoriteButton.propTypes = {
  item: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  member: PropTypes.instanceOf(Map).isRequired,
};

export default FavoriteButton;
