import { RecordOf } from 'immutable';

import { IconButtonProps } from '@mui/material/IconButton';

import { FC, useContext } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { FavoriteButton as GraaspFavoriteButton } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import { FAVORITE_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { isItemFavorite } from '../../utils/item';
import { CurrentUserContext } from '../context/CurrentUserContext';

type Props = {
  item: RecordOf<Item>;
  type?: string;
  onClick?: () => void;
  size?: IconButtonProps['size'];
};

const FavoriteButton: FC<Props> = ({ item, size, type, onClick }) => {
  const { data: member } = useContext(CurrentUserContext);
  const { t } = useBuilderTranslation();
  const mutation = useMutation<any, any, any>(MUTATION_KEYS.EDIT_MEMBER);

  const isFavorite = isItemFavorite(item, member);

  const handleFavorite = () => {
    mutation.mutate({
      id: member.id,
      extra: {
        favoriteItems: member?.extra?.favoriteItems
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
        favoriteItems: member?.extra?.favoriteItems?.filter(
          (id: string) => id !== item.id,
        ),
      },
    });
    onClick?.();
  };

  const text = isFavorite
    ? t(BUILDER.FAVORITE_ITEM_REMOVE_TEXT)
    : t(BUILDER.FAVORITE_ITEM_ADD_TEXT);

  return (
    <GraaspFavoriteButton
      key={text}
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
