import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import {
  buildShareButtonId,
  SHARE_ITEM_BUTTON_CLASS,
} from '../../config/selectors';
import { LayoutContext } from '../context/LayoutContext';
import { ITEM_ACTION_TABS } from '../../config/constants';

const ShareButton = ({ itemId }) => {
  const { t } = useTranslation();
  const { openedActionTabId, setOpenedActionTabId } = useContext(LayoutContext);

  const onClick = () => {
    setOpenedActionTabId(
      openedActionTabId === ITEM_ACTION_TABS.SHARING
        ? null
        : ITEM_ACTION_TABS.SHARING,
    );
  };

  return (
    <Tooltip title={t('Share')}>
      <IconButton
        aria-label="share"
        className={SHARE_ITEM_BUTTON_CLASS}
        onClick={onClick}
        id={buildShareButtonId(itemId)}
      >
        {openedActionTabId === ITEM_ACTION_TABS.SHARING ? (
          <CloseIcon />
        ) : (
          <ShareIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

ShareButton.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default ShareButton;
