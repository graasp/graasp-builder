import { Box, Grid2 as Grid, Typography } from '@mui/material';

import {
  DiscriminatedItem,
  ItemType,
  formatDate,
  getLinkThumbnailUrl,
} from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Card, TextDisplay } from '@graasp/ui';

import i18n, { useCommonTranslation } from '@/config/i18n';
import { buildItemPath } from '@/config/paths';
import { ITEM_CARD_CLASS, buildItemCard } from '@/config/selectors';

type Props = {
  item: DiscriminatedItem;
  dense?: boolean;
  footer: JSX.Element;
  isOver?: boolean;
  isDragging?: boolean;
  disabled?: boolean;
  menu?: JSX.Element;
  isSelected?: boolean;
  allowNavigation?: boolean;
  onThumbnailClick?: () => void;
  thumbnailUrl?: string;
};

const ItemCard = ({
  item,
  footer,
  dense = true,
  isDragging = false,
  isOver = false,
  isSelected = false,
  disabled,
  menu,
  allowNavigation = true,
  thumbnailUrl,
  onThumbnailClick,
}: Props): JSX.Element => {
  const { t: translateCommon } = useCommonTranslation();

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
    <Grid
      container
      height="100%"
      justifyContent="flex-start"
      alignItems="center"
      pl={1}
    >
      {dense ? (
        <>
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 6,
            }}
          >
            <Typography variant="caption">{item.type}</Typography>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 6,
            }}
          >
            <Typography variant="caption">
              {dateColumnFormatter(item.updatedAt)}
            </Typography>
          </Grid>
        </>
      ) : (
        <Grid size={12}>
          <Typography variant="caption">
            <TextDisplay content={item.description ?? ''} />
          </Typography>
        </Grid>
      )}
    </Grid>
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
        thumbnail={thumbnail}
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
