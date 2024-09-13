import { Link } from 'react-router-dom';

import { IconButton, Tooltip } from '@mui/material';

import { LibraryBigIcon } from 'lucide-react';

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

  const title = translateBuilder(BUILDER.LIBRARY_SETTINGS_BUTTON_TITLE);

  return (
    <Tooltip title={title}>
      <IconButton
        aria-label={title}
        className={PUBLISH_ITEM_BUTTON_CLASS}
        id={buildPublishButtonId(itemId)}
        to={buildItemPublishPath(itemId)}
        component={Link}
      >
        <LibraryBigIcon />
      </IconButton>
    </Tooltip>
  );
};

export default PublishButton;
