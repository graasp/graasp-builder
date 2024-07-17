import { Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import {
  ItemType,
  PackedItem,
  ThumbnailSize,
  formatDate,
  getLinkThumbnailUrl,
} from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Card, TextDisplay } from '@graasp/ui';

import i18n, { useCommonTranslation } from '@/config/i18n';
import { buildItemPath } from '@/config/paths';
import { hooks } from '@/config/queryClient';
import { ITEM_CARD_CLASS, buildItemCard } from '@/config/selectors';

type Props = {
  item: PackedItem;
  dense?: boolean;
  showThumbnail?: boolean;
  footer: JSX.Element;
  isOver?: boolean;
  isDragging?: boolean;
  disabled?: boolean;
  menu?: JSX.Element;
  isSelected?: boolean;
  allowNavigation?: boolean;
  onThumbnailClick?: () => void;
};

const ItemCard = ({
  item,
  footer,
  dense = true,
  isDragging = false,
  isOver = false,
  isSelected = false,
  showThumbnail = true,
  disabled,
  menu,
  allowNavigation = true,
  onThumbnailClick,
}: Props): JSX.Element => {
  const { t: translateCommon } = useCommonTranslation();
  const { data: thumbnailUrl } = hooks.useItemThumbnailUrl({
    id: showThumbnail ? item.id : undefined,
    size: ThumbnailSize.Medium,
  });

  const dateColumnFormatter = (value: string) =>
    formatDate(value, {
      locale: i18n.language,
      defaultValue: translateCommon(COMMON.UNKNOWN_DATE),
    });

  const to =
    item.type === ItemType.SHORTCUT
      ? buildItemPath(item.extra.shortcut.target)
      : buildItemPath(item.id);

  const content = (
    <Grid2
      container
      height="100%"
      justifyContent="flex-start"
      alignItems="center"
      pl={1}
    >
      {dense ? (
        <>
          <Grid2 xs={12} sm={12} md={6}>
            <Typography variant="caption">{item.type}</Typography>
          </Grid2>
          <Grid2 xs={12} sm={12} md={6}>
            <Typography variant="caption">
              {dateColumnFormatter(item.updatedAt)}
            </Typography>
          </Grid2>
        </>
      ) : (
        <Grid2 xs={12}>
          <Typography variant="caption">
            <TextDisplay content={item.description ?? ''} />
          </Typography>
        </Grid2>
      )}
    </Grid2>
  );

  // show link thumbnail
  let thumbnail = thumbnailUrl;
  if (!thumbnail && item.type === ItemType.LINK) {
    thumbnail = getLinkThumbnailUrl(item.extra);
  }

  return (
    <Box data-id={item.id}>
      <Card
        onThumbnailClick={onThumbnailClick}
        className={ITEM_CARD_CLASS}
        id={buildItemCard(item.id)}
        sx={{ background: disabled ? 'lightgrey' : undefined }}
        dense={dense}
        elevation={false}
        thumbnail={thumbnailUrl}
        to={allowNavigation ? to : undefined}
        name={item.name}
        alt={item.name}
        type={item.type}
        footer={footer}
        creator={item.creator?.name}
        content={content}
        fullWidth
        menu={menu}
        isDragging={isDragging}
        isOver={isOver}
        isSelected={isSelected}
      />
    </Box>
  );
};
export default ItemCard;
