import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ExploreIcon from '@material-ui/icons/Explore';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import {
  buildPublishButtonId,
  PUBLISH_ITEM_BUTTON_CLASS,
} from '../../config/selectors';
import { LayoutContext } from '../context/LayoutContext';
import { ITEM_ACTION_TABS } from '../../config/constants';

const PublishButton = ({ itemId }) => {
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
          <ExploreIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

PublishButton.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default PublishButton;
