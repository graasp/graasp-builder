import { ShortLink, ShortLinkPlatform } from '@graasp/sdk';
import { BuildIcon, GraaspLogo, LibraryIcon, PlayIcon } from '@graasp/ui';

const DEFAULT_ICON_SIZE = 25;

type Props = {
  platform: ShortLink['platform'];
  accentColor: string;
  size?: number;
};

const PlatformIcon = ({
  platform,
  accentColor,
  size = DEFAULT_ICON_SIZE,
}: Props): JSX.Element => {
  switch (platform) {
    case ShortLinkPlatform.Builder:
      return <BuildIcon size={size} primaryColor={accentColor} />;
    case ShortLinkPlatform.Player:
      return <PlayIcon size={size} primaryColor={accentColor} />;
    case ShortLinkPlatform.Library:
      return <LibraryIcon size={size} primaryColor={accentColor} />;
    default:
      console.error(`Undefined platform ${platform}.`);
      return <GraaspLogo height={size} sx={{ fill: accentColor }} />;
  }
};

export default PlatformIcon;
