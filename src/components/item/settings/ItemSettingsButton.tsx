import { useNavigate } from 'react-router';

import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

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
  const navigate = useNavigate();

  const onClickSettings = () => {
    navigate(buildItemSettingsPath(id));
  };

  return (
    <Tooltip title={translateBuilder(BUILDER.SETTINGS_TITLE)}>
      <span>
        <IconButton
          onClick={onClickSettings}
          className={ITEM_SETTINGS_BUTTON_CLASS}
          id={buildSettingsButtonId(id)}
        >
          <SettingsIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ItemSettingsButton;
