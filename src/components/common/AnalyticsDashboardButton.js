import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PieChartIcon from '@material-ui/icons/PieChart';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import { LayoutContext } from '../context/LayoutContext';
import { buildDashboardButtonId } from '../../config/selectors';
import { ITEM_ACTION_TABS } from '../../config/constants';

const AnalyticsDashboardButton = ({ id }) => {
  const { t } = useTranslation();
  const { openedActionTabId, setOpenedActionTabId } = useContext(LayoutContext);

  return (
    <Tooltip title={t('Analytics Dashboard')}>
      <IconButton
        aria-label={t('Analytics Dashboard')}
        onClick={() => setOpenedActionTabId(ITEM_ACTION_TABS.DASHBOARD)}
        id={buildDashboardButtonId(id)}
      >
        {openedActionTabId === ITEM_ACTION_TABS.DASHBOARD ? (
          <CloseIcon />
        ) : (
          <PieChartIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

AnalyticsDashboardButton.propTypes = {
  id: PropTypes.string.isRequired,
};

export default AnalyticsDashboardButton;
