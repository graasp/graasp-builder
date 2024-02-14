import { Link } from 'react-router-dom';

import { Settings } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { buildItemSettingsPath } from '@/config/paths';

import { useBuilderTranslation } from '../../../config/i18n';
import {
  ITEM_SETTINGS_BUTTON_CLASS,
  buildSettingsButtonId,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

type Props = {
  id: string;
};

const ItemSettingsButton = ({ id }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  return (
    <Tooltip title={translateBuilder(BUILDER.SETTINGS_TITLE)}>
      <IconButton
        component={Link}
        to={buildItemSettingsPath(id)}
        className={ITEM_SETTINGS_BUTTON_CLASS}
        id={buildSettingsButtonId(id)}
      >
        <Settings />
      </IconButton>
    </Tooltip>
  );
};

export default ItemSettingsButton;
