import CloseIcon from '@mui/icons-material/Close';
import ExploreIcon from '@mui/icons-material/Explore';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { FC } from 'react';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import {
  PUBLISH_ITEM_BUTTON_CLASS,
  buildPublishButtonId,
} from '../../config/selectors';
import { ItemActionTabs } from '../../enums';
import { useLayoutContext } from '../context/LayoutContext';

type Props = {
  itemId: string;
};

const PublishButton: FC<Props> = ({ itemId }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { openedActionTabId, setOpenedActionTabId } = useLayoutContext();

  const onClick = () => {
    setOpenedActionTabId(
      openedActionTabId === ItemActionTabs.Library
        ? null
        : ItemActionTabs.Library,
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
        {openedActionTabId === ItemActionTabs.Library ? (
          <CloseIcon />
        ) : (
          <ExploreIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default PublishButton;
