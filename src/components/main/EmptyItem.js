import Typography from '@mui/material/Typography';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { ITEMS_GRID_NO_ITEM_ID } from '../../config/selectors';

const EmptyItem = () => {
  const { t } = useBuilderTranslation();

  return (
    <Typography
      id={ITEMS_GRID_NO_ITEM_ID}
      variant="subtitle1"
      align="center"
      display="block"
    >
      {t(BUILDER.EMPTY_ITEM_MESSAGE)}
    </Typography>
  );
};

export default EmptyItem;
