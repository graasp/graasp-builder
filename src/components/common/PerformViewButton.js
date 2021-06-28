import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { redirect } from '../../utils/navigation';
import { buildGraaspPerformView } from '../../config/paths';
import { buildPerformButtonId } from '../../config/selectors';

const PerformViewButton = ({ itemId }) => {
  const { t } = useTranslation();

  const onClickPerformView = () => {
    redirect(buildGraaspPerformView(itemId), { openInNewTab: true });
  };

  return (
    <Tooltip title={t('Show Perform View')}>
      <IconButton
        aria-label={t('perform view')}
        onClick={onClickPerformView}
        id={buildPerformButtonId(itemId)}
      >
        <PlayCircleFilledIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

PerformViewButton.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default PerformViewButton;
