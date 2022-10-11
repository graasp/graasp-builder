import Typography from '@mui/material/Typography';

import { useTranslation } from 'react-i18next';

import { ITEMS_GRID_NO_ITEM_ID } from '../../config/selectors';

const EmptyItem = () => {
  const { t } = useTranslation();

  return (
    <Typography
      id={ITEMS_GRID_NO_ITEM_ID}
      variant="subtitle1"
      align="center"
      display="block"
    >
      {t('This item is empty.')}
    </Typography>
  );
};

export default EmptyItem;
