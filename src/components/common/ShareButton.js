import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { SHARE_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { setShareModalSettings } from '../../actions';

const Item = ({ itemId, dispatchSetShareModalSettings }) => {
  const { t } = useTranslation();

  const handleShare = () => {
    dispatchSetShareModalSettings({ open: true, itemId });
  };

  return (
    <Tooltip title={t('Share')}>
      <IconButton
        aria-label="share"
        className={SHARE_ITEM_BUTTON_CLASS}
        onClick={handleShare}
      >
        <ShareIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

Item.propTypes = {
  itemId: PropTypes.string.isRequired,
  dispatchSetShareModalSettings: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  dispatchSetShareModalSettings: setShareModalSettings,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(Item);

export default ConnectedComponent;
