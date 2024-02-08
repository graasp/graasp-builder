import { IconButton, Tooltip } from '@mui/material';

import { redirect } from '@graasp/sdk';
import { PlayIcon } from '@graasp/ui';

import { ITEM_HEADER_ICON_HEIGHT } from '@/config/constants';
import { buildGraaspPlayerView } from '@/config/externalPaths';
import { useBuilderTranslation } from '@/config/i18n';

import {
  buildPlayerButtonId,
  buildPlayerTabName,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

type Props = {
  itemId: string;
};

const PlayerViewButton = ({ itemId }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const onClick = () => {
    redirect(window, buildGraaspPlayerView(itemId), {
      name: buildPlayerTabName(itemId),
      openInNewTab: true,
    });
  };

  return (
    <Tooltip title={translateBuilder(BUILDER.PLAY_BUTTON_TOOLTIP)}>
      <span>
        <IconButton
          aria-label={translateBuilder(BUILDER.PLAY_BUTTON_TOOLTIP)}
          onClick={onClick}
          id={buildPlayerButtonId(itemId)}
        >
          <PlayIcon size={ITEM_HEADER_ICON_HEIGHT} primaryColor="grey" />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default PlayerViewButton;
