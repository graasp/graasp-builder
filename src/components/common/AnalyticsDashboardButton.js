import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import PieChartIcon from '@mui/icons-material/PieChart';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { ITEM_ACTION_TABS } from '../../config/constants';
import { buildDashboardButtonId } from '../../config/selectors';
import { LayoutContext } from '../context/LayoutContext';

const AnalyticsDashboardButton = ({ id }) => {
  const { t } = useTranslation();
  const { openedActionTabId, setOpenedActionTabId } = useContext(LayoutContext);

  const onClick = () => {
    setOpenedActionTabId(
      openedActionTabId === ITEM_ACTION_TABS.DASHBOARD
        ? null
        : ITEM_ACTION_TABS.DASHBOARD,
    );
  };

  return (
    <Tooltip title={t('Analytics Dashboard')}>
      <IconButton
        aria-label={t('Analytics Dashboard')}
        onClick={onClick}
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
