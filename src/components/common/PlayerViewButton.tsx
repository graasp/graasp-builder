import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { FC } from 'react';

import { redirect } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { PlayIcon } from '@graasp/ui';

import { ITEM_HEADER_ICON_HEIGHT } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { buildGraaspPlayerView } from '../../config/paths';
import {
  buildPlayerButtonId,
  buildPlayerTabName,
} from '../../config/selectors';

type Props = {
  itemId: string;
};

const PlayerViewButton: FC<Props> = ({ itemId }) => {
  const { t: translateBuilder } = useBuilderTranslation();

  const onClick = () => {
    redirect(buildGraaspPlayerView(itemId), {
      name: buildPlayerTabName(itemId),
      openInNewTab: true,
    });
  };

  return (
    <Tooltip title={translateBuilder(BUILDER.PLAY_BUTTON_TOOLTIP)}>
      <IconButton
        aria-label={translateBuilder(BUILDER.PLAY_BUTTON_TOOLTIP)}
        onClick={onClick}
        id={buildPlayerButtonId(itemId)}
      >
        <PlayIcon size={ITEM_HEADER_ICON_HEIGHT} primaryColor="grey" />
      </IconButton>
    </Tooltip>
  );
};

export default PlayerViewButton;
