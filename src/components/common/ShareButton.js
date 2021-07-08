import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import {
  buildShareButtonId,
  SHARE_ITEM_BUTTON_CLASS,
} from '../../config/selectors';
import { ShareItemModalContext } from '../context/ShareItemModalContext';

const ShareButton = ({ itemId }) => {
  const { t } = useTranslation();
  const { openModal } = useContext(ShareItemModalContext);

  const handleShare = () => {
    openModal(itemId);
  };

  return (
    <Tooltip title={t('Share')}>
      <IconButton
        aria-label="share"
        className={SHARE_ITEM_BUTTON_CLASS}
        onClick={handleShare}
        id={buildShareButtonId(itemId)}
      >
        <ShareIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

ShareButton.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default ShareButton;
