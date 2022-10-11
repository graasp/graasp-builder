import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { LibraryIcon } from '@graasp/ui';

import { ITEM_ACTION_TABS } from '../../config/constants';
import {
  PUBLISH_ITEM_BUTTON_CLASS,
  buildPublishButtonId,
} from '../../config/selectors';
import { LayoutContext } from '../context/LayoutContext';

type Props = {
  itemId: string;
};

const PublishButton: FC<Props> = ({ itemId }) => {
  const { t } = useTranslation();
  const { openedActionTabId, setOpenedActionTabId } = useContext(LayoutContext);

  const onClick = () => {
    setOpenedActionTabId(
      openedActionTabId === ITEM_ACTION_TABS.LIBRARY
        ? null
        : ITEM_ACTION_TABS.LIBRARY,
    );
  };

  return (
    <Tooltip title={t('Publish')}>
      <IconButton
        aria-label="publish"
        className={PUBLISH_ITEM_BUTTON_CLASS}
        onClick={onClick}
        id={buildPublishButtonId(itemId)}
      >
        {openedActionTabId === ITEM_ACTION_TABS.LIBRARY ? (
          <CloseIcon />
        ) : (
          <LibraryIcon size={30} primaryColor="grey" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default PublishButton;
