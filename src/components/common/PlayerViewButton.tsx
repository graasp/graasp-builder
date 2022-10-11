import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { redirect } from '@graasp/sdk';
import { PlayIcon } from '@graasp/ui';

import { buildGraaspPlayerView } from '../../config/paths';
import {
  buildPlayerButtonId,
  buildPlayerTabName,
} from '../../config/selectors';

type Props = {
  itemId: string;
};

const PlayerViewButton: FC<Props> = ({ itemId }) => {
  const { t } = useTranslation();

  const onClick = () => {
    redirect(buildGraaspPlayerView(itemId), {
      name: buildPlayerTabName(itemId),
      openInNewTab: true,
    });
  };

  return (
    <Tooltip title={t('Show Player View')}>
      <IconButton
        aria-label={t('player view')}
        onClick={onClick}
        id={buildPlayerButtonId(itemId)}
      >
        <PlayIcon size={30} primaryColor="grey" />
      </IconButton>
    </Tooltip>
  );
};

export default PlayerViewButton;
