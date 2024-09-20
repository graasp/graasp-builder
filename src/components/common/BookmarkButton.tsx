import { IconButtonProps } from '@mui/material';

import { DiscriminatedItem, ItemBookmark } from '@graasp/sdk';
import {
  ActionButtonVariant,
  BookmarkButton as GraaspBookmarkButton,
} from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks, mutations } from '../../config/queryClient';
import { BUILDER } from '../../langs/constants';

type Props = {
  item: DiscriminatedItem;
  type?: ActionButtonVariant;
  onClick?: () => void;
  size?: IconButtonProps['size'];
  className?: string;
};

const isItemBookmarked = (
  item: DiscriminatedItem,
  bookmarks?: ItemBookmark[],
): boolean => bookmarks?.some((f) => f.item.id === item.id) || false;

const BookmarkButton = ({
  item,
  size,
  type,
  onClick,
  className,
}: Props): JSX.Element | null => {
  const { data: bookmarks } = hooks.useBookmarkedItems();
  const { t: translateBuilder } = useBuilderTranslation();
  const addFavorite = mutations.useAddBookmarkedItem();
  const deleteFavorite = mutations.useRemoveBookmarkedItem();

  const isFavorite = isItemBookmarked(item, bookmarks);

  const handleFavorite = () => {
    addFavorite.mutate(item.id);
    onClick?.();
  };

  const handleUnbookmark = () => {
    deleteFavorite.mutate(item.id);
    onClick?.();
  };

  const text = isFavorite
    ? translateBuilder(BUILDER.BOOKMARKED_ITEM_REMOVE_TEXT)
    : translateBuilder(BUILDER.BOOKMARKED_ITEM_ADD_TEXT);

  return (
    <GraaspBookmarkButton
      className={className}
      isFavorite={isFavorite}
      ariaLabel={text}
      handleUnbookmark={handleUnbookmark}
      handleBookmark={handleFavorite}
      tooltip={text}
      type={type}
      size={size}
      text={text}
    />
  );
};

export default BookmarkButton;
