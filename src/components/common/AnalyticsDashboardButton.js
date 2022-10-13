import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import PieChartIcon from '@mui/icons-material/PieChart';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useContext } from 'react';

import { BUILDER } from '@graasp/translations';
import { AnalyticsIcon } from '@graasp/ui';

import { ITEM_ACTION_TABS } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { buildDashboardButtonId } from '../../config/selectors';
import { LayoutContext } from '../context/LayoutContext';

const AnalyticsDashboardButton = ({ id }) => {
  const { t } = useBuilderTranslation();
  const { openedActionTabId, setOpenedActionTabId } = useContext(LayoutContext);

  const onClick = () => {
    setOpenedActionTabId(
      openedActionTabId === ITEM_ACTION_TABS.DASHBOARD
        ? null
        : ITEM_ACTION_TABS.DASHBOARD,
    );
  };

  return (
    <Tooltip title={t(BUILDER.ANALYTICS_DASHBOARD_LABEL)}>
      <IconButton
        aria-label={t(BUILDER.ANALYTICS_DASHBOARD_LABEL)}
        onClick={onClick}
        id={buildDashboardButtonId(id)}
      >
        {openedActionTabId === ITEM_ACTION_TABS.DASHBOARD ? (
          <CloseIcon />
        ) : (
          <AnalyticsIcon primaryColor="grey" size={30} />
        )}
      </IconButton>
    </Tooltip>
  );
};

AnalyticsDashboardButton.propTypes = {
  id: PropTypes.string.isRequired,
};

export default AnalyticsDashboardButton;
