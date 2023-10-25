import { IconButtonProps } from '@mui/material/IconButton';

import { ItemFavoriteRecord, ItemRecord } from '@graasp/sdk/frontend';
import {
  ActionButtonVariant,
  FavoriteButton as GraaspFavoriteButton,
} from '@graasp/ui';

import { List } from 'immutable';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks, mutations } from '../../config/queryClient';
import { FAVORITE_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { useCurrentUserContext } from '../context/CurrentUserContext';

type Props = {
  item: ItemRecord;
  type?: ActionButtonVariant;
  onClick?: () => void;
  size?: IconButtonProps['size'];
};

const isItemFavorite = (
  item: ItemRecord,
  favorites?: List<ItemFavoriteRecord>,
): boolean => favorites?.some((f) => f.item.id === item.id) || false;
const FavoriteButton = ({
  item,
  size,
  type,
  onClick,
}: Props): JSX.Element | null => {
  const { data: member } = useCurrentUserContext();
  const { data: favorites } = hooks.useFavoriteItems();
  const { t: translateBuilder } = useBuilderTranslation();
  const addFavorite = mutations.useAddFavoriteItem();
  const deleteFavorite = mutations.useRemoveFavoriteItem();

  if (!member) {
    return null;
  }

  const isFavorite = isItemFavorite(
    item,
    favorites as List<ItemFavoriteRecord>,
  );

  const handleFavorite = () => {
    addFavorite.mutate(item.id);
    onClick?.();
  };

  const handleUnfavorite = () => {
    deleteFavorite.mutate(item.id);
    onClick?.();
  };

  const text = isFavorite
    ? translateBuilder(BUILDER.FAVORITE_ITEM_REMOVE_TEXT)
    : translateBuilder(BUILDER.FAVORITE_ITEM_ADD_TEXT);

  return (
    <GraaspFavoriteButton
      isFavorite={isFavorite}
      className={FAVORITE_ITEM_BUTTON_CLASS}
      ariaLabel={text}
      handleUnfavorite={handleUnfavorite}
      handleFavorite={handleFavorite}
      tooltip={text}
      type={type}
      size={size}
      text={text}
    />
  );
};

export default FavoriteButton;
