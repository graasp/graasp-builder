import CloseIcon from '@mui/icons-material/Close';
import ExploreIcon from '@mui/icons-material/Explore';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { FC } from 'react';

import { BUILDER } from '@graasp/translations';

import { ITEM_ACTION_TABS } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import {
  PUBLISH_ITEM_BUTTON_CLASS,
  buildPublishButtonId,
} from '../../config/selectors';
import { useLayoutContext } from '../context/LayoutContext';

type Props = {
  itemId: string;
};

const PublishButton: FC<Props> = ({ itemId }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { openedActionTabId, setOpenedActionTabId } = useLayoutContext();

  const onClick = () => {
    setOpenedActionTabId(
      openedActionTabId === ITEM_ACTION_TABS.LIBRARY
        ? null
        : ITEM_ACTION_TABS.LIBRARY,
    );
  };

  const title = translateBuilder(BUILDER.LIBRARY_SETTINGS_BUTTON_TITLE);

  return (
    <Tooltip title={title}>
      <IconButton
        aria-label={title}
        className={PUBLISH_ITEM_BUTTON_CLASS}
        onClick={onClick}
        id={buildPublishButtonId(itemId)}
      >
        {openedActionTabId === ITEM_ACTION_TABS.LIBRARY ? (
          <CloseIcon />
        ) : (
          <ExploreIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default PublishButton;
