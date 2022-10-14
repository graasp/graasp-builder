import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { FC } from 'react';

import { redirect } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { PlayIcon } from '@graasp/ui';

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
  const { t } = useBuilderTranslation();

  const onClick = () => {
    redirect(buildGraaspPlayerView(itemId), {
      name: buildPlayerTabName(itemId),
      openInNewTab: true,
    });
  };

  return (
    <Tooltip title={t(BUILDER.PLAY_BUTTON_TOOLTIP)}>
      <IconButton
        aria-label={t(BUILDER.PLAY_BUTTON_TOOLTIP)}
        onClick={onClick}
        id={buildPlayerButtonId(itemId)}
      >
        <PlayIcon size={30} primaryColor="grey" />
      </IconButton>
    </Tooltip>
  );
};

export default PlayerViewButton;
