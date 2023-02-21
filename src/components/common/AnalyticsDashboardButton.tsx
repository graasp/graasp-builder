import CloseIcon from '@mui/icons-material/Close';
import PieChartIcon from '@mui/icons-material/PieChart';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { FC } from 'react';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { buildDashboardButtonId } from '../../config/selectors';
import { ItemActionTabs } from '../../enums';
import { useLayoutContext } from '../context/LayoutContext';

type Props = {
  id: string;
};

const AnalyticsDashboardButton: FC<Props> = ({ id }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { openedActionTabId, setOpenedActionTabId } = useLayoutContext();

  const onClick = () => {
    setOpenedActionTabId(
      openedActionTabId === ItemActionTabs.Dashboard
        ? null
        : ItemActionTabs.Dashboard,
    );
  };

  return (
    <Tooltip title={translateBuilder(BUILDER.ANALYTICS_DASHBOARD_LABEL)}>
      <IconButton
        aria-label={translateBuilder(BUILDER.ANALYTICS_DASHBOARD_LABEL)}
        onClick={onClick}
        id={buildDashboardButtonId(id)}
      >
        {openedActionTabId === ItemActionTabs.Dashboard ? (
          <CloseIcon />
        ) : (
          <PieChartIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default AnalyticsDashboardButton;
