import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { Context, ItemPublished, ShortLink } from '@graasp/sdk';

import { useEnumsTranslation } from '@/config/i18n';
import { SHORT_LINK_PLATFORM_SELECT_ID } from '@/config/selectors';

type ShortLinkPlatform = ShortLink['platform'];
type Props = {
  platform: ShortLinkPlatform;
  publishedEntry?: ItemPublished;
  onChange: (newPlatform: ShortLinkPlatform) => void;
};

const PlatformSelect = ({
  platform,
  publishedEntry,
  onChange,
}: Props): JSX.Element => {
  const { t: enumT } = useEnumsTranslation();

  const handlePlatformChange = (event: SelectChangeEvent<ShortLinkPlatform>) =>
    onChange(event.target.value as ShortLinkPlatform);

  return (
    <Select
      sx={{ ml: 1, textTransform: 'capitalize' }}
      value={platform}
      onChange={handlePlatformChange}
      renderValue={(value) => enumT(value)}
      id={SHORT_LINK_PLATFORM_SELECT_ID}
      size="small"
    >
      <MenuItem value={Context.Builder}>{enumT(Context.Builder)}</MenuItem>
      <MenuItem value={Context.Player}>{enumT(Context.Player)}</MenuItem>
      {/* Check that the item is published to display library */}
      {Boolean(publishedEntry) && (
        <MenuItem value={Context.Library}>{enumT(Context.Library)}</MenuItem>
      )}
    </Select>
  );
};

export default PlatformSelect;
