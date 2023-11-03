import { Context } from '@graasp/sdk';
import { BuildIcon, GraaspLogo, LibraryIcon, PlayIcon } from '@graasp/ui';

import { ShortLinkPlatform } from '@/utils/shortLink';

const DEFAULT_ICON_SIZE = 25;

type Props = {
  platform: ShortLinkPlatform;
  accentColor: string;
  size?: number;
};

const PlatformIcon = ({
  platform,
  accentColor,
  size = DEFAULT_ICON_SIZE,
}: Props): JSX.Element => {
  switch (platform) {
    case Context.Builder:
      return <BuildIcon size={size} primaryColor={accentColor} />;
    case Context.Player:
      return <PlayIcon size={size} primaryColor={accentColor} />;
    case Context.Library:
      return <LibraryIcon size={size} primaryColor={accentColor} />;
    default:
      console.error(`Undefined platform ${platform}.`);
      return <GraaspLogo height={size} sx={{ fill: accentColor }} />;
  }
};

export default PlatformIcon;
