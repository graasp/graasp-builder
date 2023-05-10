import { IconButtonProps } from '@mui/material/IconButton';

import { FC } from 'react';

import { ItemRecord, MemberRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import {
  ActionButtonVariant,
  FavoriteButton as GraaspFavoriteButton,
} from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { FAVORITE_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { useCurrentUserContext } from '../context/CurrentUserContext';

type Props = {
  item: ItemRecord;
  type?: ActionButtonVariant;
  onClick?: () => void;
  size?: IconButtonProps['size'];
};

export const isItemFavorite = (
  item: ItemRecord,
  member: MemberRecord,
): boolean => member.extra?.favoriteItems?.includes(item.id) || false;

const FavoriteButton: FC<Props> = ({ item, size, type, onClick }) => {
  const { data: member } = useCurrentUserContext();
  const { t: translateBuilder } = useBuilderTranslation();
  const mutation = mutations.useEditMember();

  const isFavorite = isItemFavorite(item, member);

  const handleFavorite = () => {
    mutation.mutate({
      id: member.id,
      extra: {
        favoriteItems: member?.extra?.favoriteItems
          ? member.extra.favoriteItems.concat([item.id]).toJS()
          : [item.id],
      },
    });
    onClick?.();
  };

  const handleUnfavorite = () => {
    mutation.mutate({
      id: member.id,
      extra: {
        favoriteItems: member?.extra?.favoriteItems
          ?.filter((id: string) => id !== item.id)
          .toJS(),
      },
    });
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
