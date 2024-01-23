import { useNavigate } from 'react-router';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { LibraryIcon } from '@graasp/ui';

import { buildItemPublishPath } from '@/config/paths';

import { useBuilderTranslation } from '../../config/i18n';
import {
  PUBLISH_ITEM_BUTTON_CLASS,
  buildPublishButtonId,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

type Props = {
  itemId: string;
};

const PublishButton = ({ itemId }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const navigate = useNavigate();

  const onClick = () => {
    navigate(buildItemPublishPath(itemId));
  };

  const title = translateBuilder(BUILDER.LIBRARY_SETTINGS_BUTTON_TITLE);

  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          aria-label={title}
          className={PUBLISH_ITEM_BUTTON_CLASS}
          onClick={onClick}
          id={buildPublishButtonId(itemId)}
        >
          <LibraryIcon size={24} showSetting primaryColor="#777" />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default PublishButton;
